function Watcher(vm, exp, cb) {
    this.cb = cb
    this.vm = vm
    this.exp = exp
    this.value = this.get() // 订阅
}
Watcher.prototype = {
    update: function() {
        var val = this.vm.data[this.exp]
        var oldVal = this.value
        if (val !== oldVal) {
            this.value = val
            this.cb.call(this.vm, val, oldVal)
        }
    },
    get: function () {
        Dep.target = this
        var value = this.vm.data[this.exp]
        Dep.target = null
        return value
    }
}