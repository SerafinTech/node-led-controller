const util = require('../util.js')

class sk6812rgbw {
  constructor(n) {
    this.ledCount = n
    this.frequency = 3000000
    this.ledBuffer = Buffer.alloc(this.ledCount * 4, '00000000', 'hex')
  }

  setLedColor(n, r, g, b, w = -1) {
    let index = n * 4
    let color = {r: r, g: g, b: b, w: w}
    
    if(w < 0 && r + g + b !== 0) {
      color = util.convertRGBtoRGBW(r, g, b)
    } else {
      color.w = 0
    }
    this.ledBuffer[index] = color.g
    this.ledBuffer[index + 1] = color.r
    this.ledBuffer[index + 2] = color.b
    this.ledBuffer[index + 3] = color.w
    
    return color
  }

  getBuffer() {
    let targetBuffer = Buffer.alloc(this.ledBuffer.length * 4)
    for(let i = 0; i < this.ledBuffer.length; i++) {
      let buf = util.convertToBitMod(this.ledBuffer[i])
      buf.copy(targetBuffer, i * 4)
    }
    return targetBuffer
  }
}

module.exports = sk6812rgbw