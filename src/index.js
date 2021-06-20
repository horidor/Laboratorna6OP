const { printToFile } = require('./printer')
const { getTriangles } = require('./scripts/parse-obj')
const { program } = require('./program')
const { Vector3 } = require('three')

const getCowAssProgram = () => {
  const x = 1
  const dx = -0.2
  const dy = 1.1
  const dz = 0.2

  return {
    objects: getTriangles('cow-original.obj'),
    imageRows: 300,
    imageCols: 300,
    cameraPosition: new Vector3(-0.5, -0.5, -0.5),
    lightPosition: new Vector3(0, 0, 0),
    planePosition: [
      new Vector3(x + dx, x + dy, 0 + dz),
      new Vector3(0 + dx, x + dy, x + dz),
      new Vector3(0 + dx, -x + dy, x + dz),
      new Vector3(x + dx, -x + dy, 0 + dz),
    ],
    printer: printToFile,
  }
}

const getCowProgram = () => {
  const x = 1.514338005875298 * 2
  const y = 1.857201500502741 * 3
  const z = -9

  return {
    objects: getTriangles('cow-centered.obj'),
    imageRows: 1000,
    imageCols: 1000,
    cameraPosition: new Vector3(0, -0.5, 5),
    lightPosition: new Vector3(5, 6, 3),
    planePosition: [
      // nowrap
      new Vector3(-x, y, z),
      new Vector3(x, y, z),
      new Vector3(x, 0, z),
      new Vector3(-x, 0, z),
    ],
    printer: printToFile,
  }
}

const getHumanProgram = () => {
  const x = 1.300943 * 2.5
  const y = 3.731315 * 2.5
  const z = -10

  return {
    objects: getTriangles('human.obj'),
    imageRows: 300,
    imageCols: 300,
    cameraPosition: new Vector3(0, -0.5, 5),
    lightPosition: new Vector3(5, 3.731315 / 2, 3),
    planePosition: [
      // nowrap
      new Vector3(-x, y, z),
      new Vector3(x, y, z),
      new Vector3(x, 0, z),
      new Vector3(-x, 0, z),
    ],
    printer: printToFile,
  }
}

program(getCowProgram())
