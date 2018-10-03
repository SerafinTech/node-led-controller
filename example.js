const LedDriver = require('./drivers/ftdi')
const ledDriver = new LedDriver('apa102c', 32*24, 1)
ledDriver.init()

const Panel = require('./layouts/panel')

const panel = new Panel()


panel.addBRVSM(32, 24)
//panel.addTLVSM(2, 2)
//console.log(panel.addTLVSM(2, 2, undefined , undefined , 0, 2))


var stdin = process.stdin
stdin.setRawMode( true )
stdin.resume()
stdin.setEncoding( 'utf8' )


let color = {
  r: 0,
  g: 0,
  b: 0,
  w: -1
}
ledDriver.sendLeds()
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
  for (let i = 0; i < 32*24; i++) {
    ledDriver.setLedColor(i, color.r, color.g, color.b, 10)
  }

  ledDriver.sendLeds()
  
})

