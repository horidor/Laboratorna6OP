const { Box3, Ray } = require('three')
const { getMinPoint, getMaxPoint, getTileCenters } = require('./math')
const { Octree } = require('./Octree')

exports.program = ({
  objects,
  imageRows,
  imageCols,
  cameraPosition,
  lightPosition,
  planePosition,
  printer,
}) => {
  // Two-dimensional array filled with zeros
  const image = Array(imageRows)
    .fill(null)
    .map(_ => Array(imageCols).fill([0, 0, 0]))

  const tileCenters = getTileCenters(planePosition, imageRows, imageCols)

  // Create tree's root.
  let octree = new Octree({
    leafCapacity: 20,
    maxDepth: 10,
    node: {
      type: 'leaf',
      box: new Box3(
        getMinPoint(objects),
        getMaxPoint(objects)
      ),
      triangles: [],
      depth: 1
    }
  })

  for (let triangle of objects) {
    octree = octree.insertTriangle(triangle)
  }

  // Iterate through all pixels in the resulting image.
  for (let i = 0; i < image.length; i += 1) {
    for (let j = 0; j < image[i].length; j += 1) {
      const planePoint = tileCenters[i][j]

      // @ts-ignore
      const cameraRay = new Ray(cameraPosition, planePoint)

      const intersectionPoint = octree.findIntersectionPoint(cameraRay)

      if (intersectionPoint !== null) {
        const cameraVector = intersectionPoint.clone().sub(cameraPosition)
        const lightVector = intersectionPoint.clone().sub(lightPosition)
        const angle = cameraVector.angleTo(lightVector)

        const shadow = 1 / intersectionPoint.distanceTo(lightPosition)
        const light = Math.abs(Math.cos(angle))

        image[i][j] = [
          255,
          Math.round((light + shadow) * 255),
          Math.round((light + shadow) * 255)
        ]
      }
    }
  }

  printer(image)
}
