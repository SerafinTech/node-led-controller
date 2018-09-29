const stream = require('stream');
const bmp = require("bmp-js")
const Panel = require('../layouts/panel')
const fs = require('fs')
const pp = new Panel()
const lame = require('lame')
const speaker = require('speaker')

const lameStream = new lame.Decoder()
lameStream.once('format', (lameFormat) => {
  lameStream.pipe(new speaker(lameFormat))
})

pp.addBRVSM(32,24)
//console.log(pp.panelArray)
//process.exit()
//console.log(panel.panelArray)
const Driver = require('../drivers/ftdi')
const driver = new Driver('apa102c', 24*32, 1.8)
driver.init()
driver.sendLeds()

var converter = new stream.Writable();
converter.data = []; // We'll store all the data inside this array
converter._write = function (chunk, encoding, cb) {
  playFrame(bmp.decode(chunk).data)
  //console.log(bmp.decode(chunk))
  cb()
};
converter.on('end', function() { // Will be emitted when the input stream has ended, ie. no more data will be provided
  //var b = Buffer.concat(this.data); // Create a buffer from all the received chunks
  // Insert your business logic here
});

//ffmpeg -i input.wmv -c:v bmp -f rawvideo -an - > output.bin
let running = false
function playFrame(frame) {
  if(!running) {
    fs.createReadStream('../Bruno Mars - 24K Magic [Official Video]-UqyT8IEBkvY.mp3').pipe(lameStream)
    running = true
  }
  for (let y = 0; y < 24; y++) {
    for(let x = 0; x < 32; x++) {
      
      let n = pp.panelArray[y][x]
      //console.log(x, y, n, frame[(x+y*8)*4+3], frame[(x+y*8)*4+2], frame[(x+y*32)*4+1])
      driver.setLedColor(n, frame[(x+y*32)*4+3], frame[(x+y*32)*4+2], frame[(x+y*32)*4+1], 10)
    }
  }
  //console.log(driver.ledDriver.getBuffer()[401])
  driver.sendLeds()
  
}

const ffmpeg = require('fluent-ffmpeg')

let videoPlayer = ffmpeg('../Bruno Mars - 24K Magic [Official Video]-UqyT8IEBkvY.mkv')

videoPlayer
    .native()
    //.videoFilter('crop=1740:1080:90:0')
    .size("32x24")
    .videoCodec('bmp')
    .format('rawvideo')
    .noAudio()
    //.fps(12)
    .output(converter)
    .on('start', (command) => {
      console.log(command)
      
    })

videoPlayer.run()