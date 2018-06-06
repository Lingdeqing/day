function MyVue(options) {
    var self = this
    this.data = options.data
    this.methods = options.methods

    Object.keys(this.data).forEach(function (key) {
        self.proxyKeys(key)
    })
    observe(this.data)
    new Compile(options.el, this)
}
MyVue.prototype = {
    proxyKeys: function (key) {
        var self = this
        Object.defineProperty(this, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                return self.data[key]
            },
            set: function (val) {
                self.data[key] = val
            }
        })
    }
}
