const { Box3, Vector3 } = require('three')

const getMiddlePoint = (min, max) => {
  return new Vector3((min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2)
}

exports.partition = (box) => {
  const { min, max } = box
  const mid = getMiddlePoint(min, max)

  return [
    new Box3(min, mid),
    new Box3(new Vector3(mid.x, min.y, min.z), new Vector3(max.x, mid.y, mid.z)),
    new Box3(new Vector3(mid.x, mid.y, min.z), new Vector3(max.x, max.y, mid.z)),
    new Box3(new Vector3(min.x, mid.y, min.z), new Vector3(mid.x, max.y, mid.z)),
    new Box3(new Vector3(min.x, min.y, mid.z), new Vector3(mid.x, mid.y, max.z)),
    new Box3(new Vector3(mid.x, min.y, mid.z), new Vector3(max.x, mid.y, max.z)),
    new Box3(new Vector3(mid.x, mid.y, mid.z), new Vector3(max.x, max.y, max.z)),
    new Box3(new Vector3(min.x, mid.y, mid.z), new Vector3(mid.x, max.y, max.z)),
  ]
}
