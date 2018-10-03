//Converts 8 bit byte to unsigned 32 bit byte as a 4 byte Buffer where a 0-bit = 0b1000 and a 1-bit = 0b1100
function convertToBitMod (byteData) {
  const lookup = {
    0: 0x8888,
    1: 0x888c,
    2: 0x88c8,
    3: 0x88cc,
    4: 0x8c88,
    5: 0x8c8c,
    6: 0x8cc8,
    7: 0x8ccc,
    8: 0xc888,
    9: 0xc88c,
    10: 0xc8c8,
    11: 0xc8cc,
    12: 0xcc88,
    13: 0xcc8c,
    14: 0xccc8,
    15: 0xcccc
  }

  let ret = 0x00000000
  ret = ret | (lookup[byteData >> 4] << 16)
  ret = ret | (lookup[byteData & 0x0f])
  let buf = Buffer.allocUnsafe(4)
  buf.writeUInt32BE(ret >>> 0)
  return buf
}

//Convert RGB to RGBW for leds that have dedicated white
function convertRGBtoRGBW(r, g, b) {
  let rgbMax = Math.max(r, g, b)
  let rgbMin = Math.min(r, g, b)

  let saturation = (rgbMax - rgbMin) / rgbMax
  let w = Math.floor((1 - saturation) * (r + g + b) / 3)
  return {
    r: r - w,
    g: g - w,
    b: b - w,
    w: w
  }
}

// return gamma correction array. When gamma = 1 corected value equals equals corrected value.
function createGammaCorrectionArray(gamma = 1) {
  let gammaArray = []

  for (let i = 0; i < 256; i++) {
    gammaArray.push(Math.floor(Math.pow(i/255, gamma) * 255 + 0.5))
  }

  return gammaArray

}

module.exports = {
  convertToBitMod: convertToBitMod,
  convertRGBtoRGBW: convertRGBtoRGBW,
  createGammaCorrectionArray: createGammaCorrectionArray
}
