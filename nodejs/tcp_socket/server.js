const net = require('net')

const HOST = '127.0.0.1'
const PORT = 6969

//  net.createServer创建一个tcp服务器实例
// 传入net.createServer的回调函数作为connection事件的处理函数
// 每一个connection事件，接收到的sock对象是唯一的
net.createServer( sock => {
    console.log('CONNECTED: ' + sock.remotePort)

    // 为这个socket添加data事件处理函数
    sock.on('data', function (data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data)
        sock.write('You said "' + data + '"')
    })

    // 为这个socket实例添加close事件处理函数
    sock.on('close', function (data) {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort)
    })
}).listen(PORT, HOST)

console.log('Server listening on '+ HOST + ':'+ PORT)