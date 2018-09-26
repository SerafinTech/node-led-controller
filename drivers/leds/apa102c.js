class apa102c {
  constructor(n) {
    this.ledCount = n
    this.frequency = 5000000
    this.ledBuffer = Buffer.alloc(this.ledCount * 4, 'E0000000', 'hex')
    this.ledBuffer = Buffer.concat([Buffer.alloc(4, '00000000', 'hex'), this.ledBuffer, Buffer.alloc(4, '00000000', 'hex')])
  }

  setLedColor(n, r, g, b, brightness = 15) {
    let index = n * 4
    index += 4
    
    this.ledBuffer[index] = brightness | 0b11100000
    this.ledBuffer[index + 1] = b
    this.ledBuffer[index + 2] = g
    this.ledBuffer[index + 3] = r
    
    return {r: r, g: g, b: b, brightness: brightness}
  }

  getBuffer() {
    return this.ledBuffer
  }
}

module.exports = apa102c