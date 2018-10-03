# Addressable Led Controller for Node

Node library for controlling strings or panels of addressable led lights. current supported leds APA102C, SK6812RGBW, WS2812B, SK9822 (These are the ones that have been tested). Drivers that are supported are the FTDI 232H and Raspberry Pi SPI GPIO output.

## Pre-req

For using with FTDI 232H, the FTDI D2xxx and MPSSE driver must be installed in the the appropriate locations.

FFMPEG must also be installed to play videos on an led panel

## Installation

`$ npm install led-controller`

## Usage Example

### Create a 5x4  led panel (width x height) and play a video on them!

```js
const LedControl = require('led-controller')

const panel = new LedControl.Panel()

// Add panel leds that start at bottom right of the panel 
// and weave back and forth verically.
// [ 19 12 11  4  3 ]
// [ 18 13 10  5  2 ]
// [ 17 14  9  6  1 ]
// [ 16 15  8  7  0 ]
const panel.addBRVSM(5,4)

// Create and initialize FTDI driver for 20 apa102c leds with a 1.8 gamma correction 
const driver = new LedControl.Drivers.FTDI('apa102c', 20, 1.8)
driver.init()

// Create video player
const videoPlayer = new LedControl.MediaPlayers.Video()

// Play video 'videofile.mp4' with brightness 5
videoPlayer.play(panel, driver, 'videofile.mp4', 5)
```



