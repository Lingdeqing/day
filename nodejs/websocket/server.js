const Http = require('http')
const Sha1 = require('sha1')

class BitBuffer {
    constructor(buffer){
        this.buffer = buffer
    }

    _getBit(offset){
        const byteIndex = offset / 8 >> 0,
            byteOffset = offset % 8

        const num = this.buffer.readUInt8(byteIndex) & (1 << (7 - byteOffset))
        return num >> (7 - byteOffset)
    }

    getBit(offset, len = 1){
        let result = 0
        for(let i = 0; i < len; i++){
            result += this._getBit(offset+ i) << (len - i - 1)
        }
        return result
    }

    getMaskingKey(offset){
        const BYTE_COUNT = 4
        const masks = []
        for(let i = 0; i < BYTE_COUNT; i++){
            masks.push(this.getBit(offset + i * 8, 8))
        }
        return masks
    }

    getXorString(byteOffset, byteCount, maskingKeys){
        let text = ''
        for(let i = 0; i < byteCount; i++){
            const transformedByte = this.buffer.readUInt8(byteOffset + i) ^ maskingKeys[i % 4]
            text += String.fromCharCode(transformedByte)
        }
        return text
    }
}

const HOST = '127.0.0.1'
const PORT = '9000'

const server = Http.createServer((req, res) => {
    console.log('recv request')
    console.log(req.headers)
})

server.on('upgrade', (req, socket, head) => {
    const secKey = req.headers['sec-websocket-key']
    const UNIQUE_IDENTIFIER = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
    const shaValue = Sha1(secKey + UNIQUE_IDENTIFIER)
    const base64Value = Buffer.from(shaValue, 'hex').toString('base64')
    socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
        'Upgrade: WebSocket\r\n' +
        'Connection: Upgrade\r\n' +
        `Sec-WebSocket-Accept: ${base64Value}\r\n` +
        '\r\n')

    socket.on('data', buffer => {
        const bitBuffer = new BitBuffer(buffer)
        const mastFlag = bitBuffer.getBit(8),
            opcode = bitBuffer.getBit(4, 4),
            payloadLen = bitBuffer.getBit(9, 7),
            maskKeys = bitBuffer.getMaskingKey(16),
            text = bitBuffer.getXorString(48 / 8, payloadLen, maskKeys)

        console.log('mastFlag = '+ mastFlag)
        console.log('opcode = '+ opcode)
        console.log('payloadLen = '+ payloadLen)
        console.log('maskKeys = '+ maskKeys)
        console.log('text = '+ text)
    })
})

server.listen(PORT, HOST, () => {
    console.log(`Server running at ${HOST}:${PORT}`)
})