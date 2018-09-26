const led = require('./drivers/leds/apa102c')

const string = new led(16)

var stdin = process.stdin
stdin.setRawMode( true )
stdin.resume()
stdin.setEncoding( 'utf8' )


const ftdi = require('./build/Release/ledftdi')

ftdi.spiInit(string.frequency)

ftdi.spiSendData(string.getBuffer())

let color = {
  r: 0,
  g: 0,
  b: 0,
  w: -1
}

stdin.on( 'data', function( key ){
  color.w = -1
  // ctrl-c ( end of text )
  if ( key === '\u0003' ) {
    process.exit();
  }
  // write the key to stdout all normal like
  if (key == 'a' && color.r > 0) {
    color.r--
  }

  if (key == 's' && color.g > 0) {
    color.g--
  }

  if (key == 'd' && color.b > 0) {
    color.b--
  }
  
  if (key == 'q' && color.r < 255) {
    color.r++
  }

  if (key == 'w' && color.g < 255) {
    color.g++
  }

  if (key == 'e' && color.b < 255) {
    color.b++
  }
  for (let i = 0; i < 16; i++) {
    string.setLedColor(i, color.r, color.g, color.b)
  }

  ftdi.spiSendData(string.getBuffer())
  
})

