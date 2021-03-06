Projection = {
    RADIUS: 6378137,
    MAX: 85.0511287798,
    RADIANS: Math.PI / 180,
    mercator: function (latitude, longitude) {
        var point = {};

        point.x = this.RADIUS * longitude * this.RADIANS;
        point.y = Math.max(Math.min(this.MAX, latitude), -this.MAX) * this.RADIANS;
        point.y = this.RADIUS * Math.log(Math.tan((Math.PI / 4) + (point.y / 2)));

        return point;
    }
}
Common = {
    json: function (url) {
        var xhr = new XMLHttpRequest()
        xhr.open('get', url, false)
        xhr.send(null)
        return JSON.parse(xhr.responseText)
    },
    extend: function (obj) {
        for (var i = 1; i < arguments.length; i++) {
            var def = arguments[i]
            for (var key in def) {
                if (obj[key] === undefined) {
                    obj[key] = def[key]
                }
            }
        }
        return obj
    },
    getBounds: function (geoJson) {
        var minX, maxX, minY, maxY
        for (var i = 0; i < geoJson.length; i++) {
            var coords = geoJson[i].geometry.coordinates[0]
            for (var j = 0; j < coords.length; j++) {
                var point = Projection.mercator(coords[j][1], coords[j][0])
                minX = minX < point.x ? minX : point.x
                minY = minY < point.y ? minY : point.y
                maxX = maxX > point.x ? maxX : point.x
                maxY = maxY > point.y ? maxY : point.y
            }
        }
        return {
            minX: minX,
            minY: minY,
            maxX: maxX,
            maxY: maxY
        }
    }
}

function Tile(options) {
    this.options = Common.extend(options, this.defaults)

    if (!this.options.geoJson) {
        throw new Error('A GeoJSON source is required to initialize')
    }

    this.initialize()
}
Tile.prototype = {
    defaults: {
        zoom: 0,    // 缩放层级
        aspectScale: 1.041975309,   // 长宽比
        center: [0, 0], // 地图中心经纬度
        waterColor: '#b3d1ff',  // 海洋颜色
        landColor: '#fff'   // 陆地颜色
    },
    initialize: function () {
        // geoJson数据
        this.geoJson = this.options.geoJson
        // 缩放倍数
        this.scale = Math.pow(2, this.options.zoom)
        // 瓦片宽度
        this.width = 256 * this.scale
        this.height = this.width * this.options.aspectScale
        // 画布
        this.tile = document.createElement('canvas')
        this.tile.width = this.width
        this.tile.height = this.height
        // 画笔
        this.context = this.tile.getContext('2d')
        // 计算投影后地理坐标范围
        this.bounds = Common.getBounds(this.geoJson)
        // 计算投影后的地理坐标缩放到瓦片上所需的缩放比例
        this.scaleRatio = this.getScaleRatio()
        // 计算瓦片中心点的盒子模型坐标
        this.center = this.coordinateToPoint(this.options.center[0], this.options.center[1])
        // 绘制地图
        this.draw()
    },
    getScaleRatio: function () {
        var xScale = this.width / (this.bounds.maxX - this.bounds.minX)
        var yScale = this.height / (this.bounds.maxY - this.bounds.minY)
        var scale = Math.min(xScale, yScale)
        return scale
    },
    coordinateToPoint: function (latitude, longitude) {
        var point = Projection.mercator(latitude, longitude)

        // 投影后的地理坐标转换为盒子模型的坐标系中的坐标
        var x = point.x - this.bounds.minX
        var y = this.bounds.maxY - point.y

        // 缩放到瓦片上
        x = x * this.scaleRatio
        y = y * this.scaleRatio

        return {
            x: x,
            y: y
        }
    },
    draw: function () {
        // 绘制海洋
        this.context.fillStyle = this.options.waterColor
        this.context.fillRect(0, 0, this.width, this.height)

        // 绘制陆地
        var geoJson = this.geoJson
        this.context.fillStyle = this.options.landColor
        for (var i = 0; i < geoJson.length; i++) {
            var coords = geoJson[i].geometry.coordinates[0]
            for (var j = 0; j < coords.length; j++) {
                var point = this.coordinateToPoint(coords[j][1], coords[j][0])

                // 绘制
                if (j === 0) {
                    this.context.beginPath()
                    this.context.moveTo(point.x, point.y)
                } else {
                    this.context.lineTo(point.x, point.y)
                }
            }
            this.context.fill()
        }
    }
}

function Map(el, options) {
    if(!el){
        throw new Error('A DOM element is required to initialize')
    }

    this.el = el
    this.options = Common.extend(options, this.defauls)
    this.initialize()
}
Map.prototype = {
    defaults: {},
    initialize: function () {
        // 地图宽高
        this.width = this.el.clientWidth
        this.height = this.el.clientHeight
        // 初始化画布
        this.createCanvas()
        // 初始化瓦片
        this.tile = new Tile(this.options)
        // 将瓦片绘制到地图画布上
        this.draw()
    },
    createCanvas: function () {
        this.el.innerHTML = ''
        this.map = document.createElement('canvas')
        this.map.width = this.width
        this.map.height = this.height
        this.el.appendChild(this.map)
        this.context = this.map.getContext('2d')
    },
    draw: function () {
        // 瓦片中心位置坐标
        var center = this.tile.center
        // 计算中心瓦片的在地图画布上的坐标
        var centerX = Math.round(this.width / 2 - center.x)
        var centerY = Math.round(this.height / 2 - center.y)
        // 计算左右侧瓦片个数
        var tileLeft = Math.ceil(centerX / this.tile.width)
        var tileRight = Math.ceil((this.width - (this.tile.width + centerX)) / this.tile.width)
        // 绘制左侧瓦片
        for(var i = 1; i <= tileLeft; i++){
            this.context.drawImage(this.tile.tile, centerX - i * this.tile.width, centerY)
        }
        // 绘制右侧瓦片
        for(var i = 1; i <= tileRight; i++){
            this.context.drawImage(this.tile.tile, centerX + i * this.tile.width, centerY)
        }
        // 绘制中心瓦片
        this.context.drawImage(this.tile.tile, centerX, centerY)
    }
}