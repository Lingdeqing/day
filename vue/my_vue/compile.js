function Compile(el, vm) {
    this.vm = vm
    this.el = document.querySelector(el)
    this.fragment = null
    this.init()
}
Compile.prototype = {
    init: function () {
        if(this.el){
            this.fragment = this.nodeToFragment(this.el)
            this.compileElement(this.fragment)
            this.el.appendChild(this.fragment)
        } else {
            console.log('dom元素不存在')
        }
    },
    nodeToFragment: function (el) {
        var fragment = document.createDocumentFragment()
        var child = el.firstChild
        while (child){
            fragment.appendChild(child)
            child = el.firstChild
        }
        return fragment
    },
    compileElement: function (el) {
        var childNodes = el.childNodes
        var self =this
        Array.prototype.slice.call(childNodes).forEach(function (node) {
            var reg = /\{\{(.*)\}\}/
            var text = node.textContent

            if(self.isElementNode(node)){
                self.compile(node)
            } else if(self.isTextNode(node) && reg.test(text)){
                self.compileText(node, reg.exec(text)[1])
            }

            if(node.childNodes && node.childNodes.length){
                self.compileElement(node)
            }
        })
    },
    compile: function (node) {
        var nodeAttrs = node.attributes
        var self = this
        Array.prototype.slice.call(nodeAttrs).forEach(function (attr) {
            var attrName = attr.name
            if(self.isDirective(attrName)){
                var exp = attr.value
                var dir = attrName.substring(2)
                if(self.isEventDirective(dir)){ // 事件指令
                    self.compileEvent(node, self.vm, exp, dir)
                } else{  // v-model
                    self.compileModel(node, self.vm, exp, dir)
                }
                node.removeAttribute(attrName)
            }
        })
    },
    isDirective: function (attr) {
        return attr.indexOf('v-') === 0
    },
    isEventDirective: function (dir) {
        return dir.indexOf('on:') === 0
    },
    isTextNode: function (node) {
        return node.nodeType == 3
    },
    isElementNode: function (node) {
        return node.nodeType == 1
    },
    compileText: function (node, exp) {
        var self = this
        var initText = this.vm[exp]
        this.updateText(node, initText)
        new Watcher(this.vm, exp, function (val) {
            self.updateText(node, val)
        })
    },
    compileModel: function (node, vm, exp, dir) {
        var self = this
        var val = this.vm[exp]
        this.updateModel(node, val)
        new Watcher(this.vm, exp, function (val) {
            self.updateModel(node, val)
        })
        
        node.addEventListener('input', function (e) {
            var newValue = e.target.value
            if(newValue === val){
                return
            }
            self.vm[exp] = newValue
            val = newValue
        })
    },
    compileEvent: function (node, vm, exp, dir) {
        var eventType = dir.split(':')[1]
        var cb = vm.methods && vm.methods[exp]

        if(eventType && cb){
            node.addEventListener(eventType, cb.bind(vm), false)
        }
    },
    updateText: function (node, val) {
        node.textContent = typeof val !== 'undefined' ? val : ''
    },
    updateModel: function (node, val) {
        node.value = typeof val !== 'undefined' ? val: ''
    }
}