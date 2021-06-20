const { createCanvas } = require('canvas')
const fs = require('fs')

exports.printToFile = (image) => {
  const width = image[0].length
  const height = image.length

  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  context.fillStyle = '#000'
  context.fillRect(0, 0, width, height)

  image.forEach((row, x) => {
    row.forEach(([r, g, b], y) => {
      context.fillStyle = `rgb(${r}, ${g}, ${b})`
      context.fillRect(y, x, 1, 1)
    })
  })

  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync('./image.png', buffer)
}
