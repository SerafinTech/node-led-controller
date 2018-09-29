class panel {
  constructor() {
    this.panelArray = []
    this.nextLed = 0
  }

  //Add panel start at `B`ottom `L`eft going `H`orizontal  in a `S`erpentine `M`atrix
  addBLHSM(width, height, pos = 'top', startn = this.nextLed, offsetx = 0, offsety = 0) {
    let newPanel = botLeftHorzSerp(width, height, startn)
    this.nextLed += width * height
    addPanel(pos, this.panelArray, newPanel, offsetx, offsety)
    return this.panelArray
  }

  //Add panel start at `T`op `L`eft going in a `V`ertical `S`erpentine `M`atrix
  addTLVSM(width, height, pos = 'right', startn = this.nextLed, offsetx = 0, offsety = 0) {
    let newPanel = topLeftVertSerpMatrix(width, height, startn)
    this.nextLed += width * height
    addPanel(pos, this.panelArray, newPanel, offsetx, offsety) 
    return this.panelArray
  }

  addBRVSM(width, height, pos = 'left', startn = this.nextLed, offsetx = 0, offsety = 0) {
    let newPanel = botRightVertSerpMatrix(width, height, startn)
    this.nextLed += width * height
    addPanel(pos, this.panelArray, newPanel, offsetx, offsety) 
    return this.panelArray
  }
}




module.exports = panel

//Adds panel to previous panel at one of four positions
function addPanel(pos, prevPanel, newPanel, offsetx = 0, offsety = 0) {
  switch(pos) {
    case 'top':
      prevPanel.unshift(...newPanel)
      break
    case 'bot':
      prevPanel.push(...newPanel)
      break
    case 'right':
      newPanel.forEach((row, n) => {
        if(prevPanel[n + offsety] === undefined) { prevPanel[n + offsety] = [] }
        prevPanel[n + offsety].push(...row)
      })
      break
    case 'left':
      newPanel.forEach((row, n) => {
        if(prevPanel[n + offsety] === undefined) { prevPanel[n + offsety]= [] }
        prevPanel[n + offsety].unshift(...row)
      })
      break
  }
}


function botLeftHorzSerp (width, height, startn = 0, numberOfLeds = width*height) {
  let matrix = []
  for (let n = 0; n < (width * height); n++) {
    let col
    let row = height - Math.floor(n/width) - 1
    if(Math.floor(n/width) % 2) {
      col = width - (n%width) - 1
    } else {
      col = n%width
    }
    if(matrix[row] === undefined) { matrix[row] = [] }
    if(n < numberOfLeds) {
      matrix[row][col] = n + startn
    } else {
      matrix[row][col] = -1
    }  
  }
  return matrix
}


function topLeftVertSerpMatrix (width, height, startn = 0, numberOfLeds = width*height) {
  var matrix = []
  for (var n = 0; n < numberOfLeds; n++) {
    var row 
    var col = Math.floor(n/height)
    if(Math.floor((n/height) % 2)) {
      row = height - (n%height) - 1
    } else {
      row = n%height
    }
    if(matrix[row] === undefined) { matrix[row] = []}
    matrix[row][col] = n + startn
  }

  return matrix
}

function botRightVertSerpMatrix (width, height, startn = 0, numberOfLeds = width*height) {
  var matrix = []
  for (var n = 0; n < numberOfLeds; n++) {
    var row 
    var col = width - Math.floor(n/height) - 1
    if(Math.floor(n/height) % 2) {
      row = n%height
    } else {
      row = height - (n%height) - 1
    }
    if(matrix[row] === undefined) { matrix[row] = []}
    matrix[row][col] = n + startn
  }

  return matrix
}