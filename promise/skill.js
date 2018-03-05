// 1.每次调用.then都会产生一个新Promise
var p = new Promise(r => {
    setTimeout(r, 1000)
})

var p1 = p.then(() => {
    console.log(1)
})
var p2 = p1.then(() => {
    console.log(2)
})
var p3 = p.then(() => {
    console.log(3)
})

console.log(p === p1)
console.log(p1 === p2)
console.log(p1 === p3)

// 2.Promise的状态一致
yourFn();
function yourFn() {
    var yourAwesomeProm = new Promise(r => {
        setTimeout(r, 1000)
    })

    // yourAwesomeProm = yourEvilUncle(yourAwesomeProm)
    yourEvilUncle(yourAwesomeProm)

    return yourAwesomeProm.then(r => console.log('处理数据'))
}
function yourEvilUncle(prom) {
    return prom.then(r => Promise.reject("搞破坏"))
}

// 3.Promise构造函数不是万精油，只在将回调函数转成promise时使用
// 一般使用promisify
const pify = require('pify')
const fs = require('fs')
const readFileASync = pify(fs.readFile)
readFileASync('skill.js', 'utf-8')
    .then(data => {
        // console.log(data)
    })
    .catch(error => {
        console.log(error)
    })


// 4.使用Promise.resolve (reject同理)
var similarProm = new Promise(res => res(5))    // 等价于下面的
// var prom = Promise.resolve(5)
// 将同步函数转换为异步函数
function foo() {
    return Promise.resolve(5)
}

// 5.不要再每个then后面使用catch，在最后使用catch
Promise.resolve()
    .then(() => a.length)
    .catch(e => {
        // return 5
        return Promise.reject(e)    // 即使提前捕获了，最好也要继续向后抛
    })
    .then(r => console.log(r))
    .catch(e => console.log(e))

// 6. then(x).catch(y)与then(x, y)
Promise.resolve()
    .then(function () {
        return Promise.reject(new Error('something wrong'))
    })
    .catch(function (e) {
        console.error(e)
    })

Promise.resolve()
    .then(function () {
        return Promise.reject(new Error('something wrong'))
    }, function (e) {
        console.error(e)
    })

// 7.避免then里面嵌套then

