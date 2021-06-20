const { Box3, Ray, Vector3 } = require('three')
const { partition } = require('./partition')

it('partition', () => {
  const boxes = partition(new Box3(new Vector3(0, 0, 2), new Vector3(2, 2, 0)))

  expect(boxes).toEqual([
    new Box3(new Vector3(0, 0, 2), new Vector3(1, 1, 1)),
    new Box3(new Vector3(1, 0, 2), new Vector3(2, 1, 1)),
    new Box3(new Vector3(1, 1, 2), new Vector3(2, 2, 1)),
    new Box3(new Vector3(0, 1, 2), new Vector3(1, 2, 1)),
    new Box3(new Vector3(0, 0, 1), new Vector3(1, 1, 0)),
    new Box3(new Vector3(1, 0, 1), new Vector3(2, 1, 0)),
    new Box3(new Vector3(1, 1, 1), new Vector3(2, 2, 0)),
    new Box3(new Vector3(0, 1, 1), new Vector3(1, 2, 0)),
  ])
})

it('intersects after partition', () => {
  const box = new Box3(new Vector3(-1, -1, -1), new Vector3(1, 1, 1))
  const ray = new Ray(new Vector3(0, 0, 0), new Vector3(1, 1, 1))

  const intersects = ray.intersectsBox(box)

  expect(intersects).toEqual(true)

  const children = partition(box)

  const parts = children
    .flatMap(partition)
    .flatMap(partition)
    .flatMap(partition)

  const atLeastOneIntersection = parts.some(child => ray.intersectsBox(child))

  expect(atLeastOneIntersection).toEqual(true)
})
