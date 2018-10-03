const Panel = require('./layouts/panel')
const Driver = require('./drivers/ftdi')
const Video = require('./media_players/video')

const panel = new Panel()
panel.addBRVSM(32,24)
const driver = new Driver('apa102c', 32*24, 1.8)
driver.init()

const videoPlayer = new Video()

const video = videoPlayer.playVideo(panel, driver, '../Imagine Dragons - Believer-7wtfhZwyrcc.mp4', 10, '../Imagine Dragons - Believer-7wtfhZwyrcc.mp3')

video.on('progress', progress => {
  console.log(progress)
})


var stdin = process.stdin
stdin.setRawMode( true )
stdin.resume()
stdin.setEncoding( 'utf8' )

stdin.on( 'data', ( key ) => {
  if(key == 'q') {
    videoPlayer.brightness += 1
  }

  if(key == 'a') {
    videoPlayer.brightness -= 1
  }

  if ( key === '\u0003' ) {
    process.exit();
  }
})

