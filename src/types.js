const { Vector3 } = require('three')

exports.movePointTowardsPoint = (p1, p2, moveDistance) => {
  const v = new Vector3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z)
  const length = p1.distanceTo(p2)
  const unit = new Vector3(v.x / length, v.y / length, v.z / length)
  return new Vector3(p1.x + unit.x * moveDistance, p1.y + unit.y * moveDistance, p1.z + unit.z * moveDistance)
}
