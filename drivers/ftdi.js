const util = require('./util')

class ftdi {
  constructor(ledDriver, numLeds, gammaCorrection = 1) {
    const LedDriver = require('./leds/'+ledDriver)
    this.ledDriver = new LedDriver(numLeds)
    this.spiDriver = require('../build/Release/ledftdi')
    this.numLeds = numLeds
    this.gammaCorrectionArray = util.createGammaCorrectionArray(gammaCorrection)
  }

  init() {
    this.devDescription = this.spiDriver.spiInit(this.ledDriver.frequency)
  }

  setLedColor(n, r, g, b, w = -1) {
    r = this.gammaCorrectionArray[r]
    g = this.gammaCorrectionArray[g]
    b = this.gammaCorrectionArray[b]
    this.ledDriver.setLedColor(n, r, g, b, w)
  }

  sendLeds() {
    this.spiDriver.spiSendData(this.ledDriver.getBuffer())
  }
}

module.exports = ftdi
