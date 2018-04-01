function Promise() {
    this.callbacks = []
    this.onCatch = null
}
Promise.prototype = {
    resolve: function (result) {
        this._complete('resolve', result)
    },
    reject: function (result) {
        this._complete('reject', result)
    },
    _complete: function (type, result) {
        if(type === 'reject' && this.onCatch){
            this.callbacks = []
            this.onCatch(result)
        } else if(this.callbacks[0]){
            var callback = this.callbacks.shift()[type]
            callback && callback(result)
        }
    },
    then: function (onSuccess, onFailed) {
        this.callbacks.push({
            resolve: onSuccess,
            reject: onFailed
        })
        return this
    },
    catch: function (onCatch) {
        this.onCatch = onCatch
    }
}
var promise = new Promise()
function step1() {
    setTimeout(function () {
        console.log('----- step1 -----')
        promise.resolve('some data')
    })
}
function step2(data) {
    setTimeout(function () {
        console.log('----- step2 -----' + data)
        promise.resolve('some data2')
    })
}
function step3(data) {
    setTimeout(function () {
        console.log('----- step3 -----' + data)
        promise.resolve('some data2')
    })
}
promise.then(step1)
    .then(step2)
    .then(step3)
promise.resolve()   // 启动promise