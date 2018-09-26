const assert = require('assert')

const convertToBitMod = require('../drivers/util').convertToBitMod

const Apa102c = require('../drivers/leds/apa102c')
const apa102c = new Apa102c(2)



describe('util', function() {
  describe('#convertToBitMod()', function() {
    it('should return 0x88888888', function() {
      assert.deepStrictEqual(convertToBitMod(0x00), Buffer.from([0x88, 0x88, 0x88, 0x88]))
    })

    it('should return 0xCCCCCCCC', function() {
      assert.deepStrictEqual(convertToBitMod(0xFF), Buffer.from([0xCC, 0xCC, 0xCC, 0xCC]))
    })
  })
})

describe('leds', function() {

  describe('apa102c', function() {
    describe('#setLedColor()', function() {     
      it('Should set led color of n = 0', function() {
        apa102c.setLedColor(0, 255, 16, 15, 31)
        assert.deepStrictEqual(apa102c.getBuffer(), Buffer.alloc(16, '00000000ff0f10ffe000000000000000', 'hex'))
      })     
      it('Should set led color of n = 1', function() {
        apa102c.setLedColor(1, 255, 16, 15, 31)
        assert.deepStrictEqual(apa102c.getBuffer(), Buffer.alloc(16, '00000000ff0f10ffff0f10ff00000000', 'hex'))
      })
    })
  })


})