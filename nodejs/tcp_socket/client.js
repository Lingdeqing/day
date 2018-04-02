const net = require('net')

const HOST = '127.0.0.1'
const PORT = 6969

const client = new net.Socket()
client.connect(PORT, HOST, function () {
    console.log('CONNECTED TO: ' + HOST + ':'+PORT)

    // 建立连接后立即向服务器发送数据
    client.write('I am client')
})
// 为客户端添加data事件处理程序
client.on('data', function (data) {
    console.log('DATA: '+ data)
    // 完全关闭连接
    client.destroy()
})
// 为客户端添加close事件处理程序
client.on('close', function () {
    console.log('Connection closed')
})