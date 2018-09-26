const util = require('../util.js')

class ws2812b {
  constructor(n) {
    this.ledCount = n
    this.frequency = 3000000
    this.ledBuffer = Buffer.alloc(this.ledCount * 3, '000000', 'hex')
    this.ledBufferLength = this.ledCount * 3
  }

  setLedColor(n, r, g, b) {
    let index = n * 3
    let color = {r: r, g: g, b: b}
    
    this.ledBuffer[index] = color.g
    this.ledBuffer[index + 1] = color.r
    this.ledBuffer[index + 2] = color.b
    
    return color
  }

  getBuffer() {
    let targetBuffer = Buffer.alloc(this.ledBufferLength * 4)
    for(let i = 0; i < this.ledBufferLength; i++) {
      let buf = util.convertToBitMod(this.ledBuffer[i])
      buf.copy(targetBuffer, i * 4)
    }
    return targetBuffer
  }
}

module.exports = ws2812b