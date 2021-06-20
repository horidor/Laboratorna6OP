const { Vector3 } = require('three')
const { movePointTowardsPoint } = require('./types')

const min = (numbers) => Math.min(...numbers)

const max = (numbers) => Math.max(...numbers)

exports.getMinPoint = (triangles) => {
  return new Vector3(
    min(triangles.flatMap(t => [t.a.x, t.b.x, t.c.x])),
    min(triangles.flatMap(t => [t.a.y, t.b.y, t.c.y])),
    min(triangles.flatMap(t => [t.a.z, t.b.z, t.c.z])),
  )
}

exports.getMaxPoint = (triangles) => {
  return new Vector3(
    max(triangles.flatMap(t => [t.a.x, t.b.x, t.c.x])),
    max(triangles.flatMap(t => [t.a.y, t.b.y, t.c.y])),
    max(triangles.flatMap(t => [t.a.z, t.b.z, t.c.z])),
  )
}

const range = (n) =>
  Array(n)
    .fill(0)
    .map((_i, idx) => idx)

// Returns two-dimensional array with centers of cells.
exports.getTileCenters = (rec, rows, cols) => {
  const recWidth = rec[0].distanceTo(rec[1])
  const recHeight = rec[0].distanceTo(rec[3])

  const tileWidth = recWidth / cols
  const tileHeight = recHeight / rows

  return range(rows).map(row => {
    return range(cols).map(col => {
      const offsetRight = col * tileWidth + tileWidth / 2
      const offsetBottom = row * tileHeight + tileHeight / 2

      const topPointMovedRight = movePointTowardsPoint(rec[0], rec[1], offsetRight)
      const bottomPointMovedRight = movePointTowardsPoint(rec[3], rec[2], offsetRight)
      const pointMovedBottom = movePointTowardsPoint(topPointMovedRight, bottomPointMovedRight, offsetBottom)
      return pointMovedBottom
    })
  })
}
