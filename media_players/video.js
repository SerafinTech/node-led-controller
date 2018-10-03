const stream = require('stream')
const bmp = require('bmp-js')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const lame = require('lame')
const speaker = require('speaker')

class videoPlayer {
  constructor() {
    this.state = 'stopped'
    this.lameStream = new lame.Decoder()
    this.lameStream.once('format', (lameFormat) => {
      this.lameStream.pipe(new speaker(lameFormat))
    })
  }

  playVideo(panel, driver, videofile, brightness, audiofile = null) {
    this.panelWidth = panel.panelArray[0].length 
    this.panelHeight = panel.panelArray.length
    this.panel = panel
    this.driver = driver
    this.vplayer = ffmpeg(videofile)
    this.audiofile = audiofile
    this.brightness = brightness

    const panelWriter = new stream.Writable()

    panelWriter._write = (chunk, encoding, callback) => {
      if(this.state === 'stopped') {
        if(this.audiofile) {
          fs.createReadStream(this.audiofile).pipe(this.lameStream)
        }
        this.state = 'playing'
      }
      
      const frame = bmp.decode(chunk).data

      for (let y = 0; y < this.panelHeight; y++) {
        for(let x = 0; x < this.panelWidth; x++) {
          
          let n = this.panel.panelArray[y][x]
          //console.log(x, y, n, frame[(x+y*8)*4+3], frame[(x+y*8)*4+2], frame[(x+y*32)*4+1])
          this.driver.setLedColor(n, frame[(x+y*this.panelWidth)*4+3], frame[(x+y*this.panelWidth)*4+2], frame[(x+y*this.panelWidth)*4+1], this.brightness)
        }
      }
      this.driver.sendLeds()

      callback()
    }

    this.vplayer
    .native()
    .size(this.panelWidth.toString()+"x"+this.panelHeight.toString())
    .videoCodec('bmp')
    .format('rawvideo')
    .noAudio()
    .output(panelWriter)

    this.vplayer.run()

    return this.vplayer
  }
}

module.exports = videoPlayer