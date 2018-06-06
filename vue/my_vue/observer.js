
function Dep() {
    this.subs = []
}
Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub)
    },
    notify: function () {
        this.subs.forEach(function (sub) {
            sub.update()
        })
    }
}

Dep.target = null



function defineReactive(data, key, val){
    observe(val)
    var dep = new Dep()
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            if(Dep.target){
                dep.addSub(Dep.target)
            }
            return val
        },
        set: function (newVal) {
            val = newVal
            console.log('属性'+ key+'已经被监听到了，现在值为：'+newVal)

            dep.notify()
        }
    })
}
function observe(data) {
    if(!data || typeof data !== 'object'){
        return
    }
    Object.keys(data).forEach(function (key) {
        defineReactive(data, key, data[key])
    })
}