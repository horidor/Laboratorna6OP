const { Box3, Ray, Triangle, Vector3 } = require('three')
const { getMinPoint, getMaxPoint } = require('./math')
const { Octree } = require('./Octree')

// Icosahedron, 20 faces, 12 vertices, 30 objects
const objects = [
  new Triangle(new Vector3(1, 0, 0.5), new Vector3(1, 0, -0.5), new Vector3(0.5, 1, 0)),
  new Triangle(new Vector3(1, 0, 0.5), new Vector3(0.5, -1, 0), new Vector3(1, 0, -0.5)),
  new Triangle(new Vector3(-1, 0, -0.5), new Vector3(-1, 0, 0.5), new Vector3(-0.5, 1, 0)),
  new Triangle(new Vector3(-1, 0, 0.5), new Vector3(-1, 0, -0.5), new Vector3(-0.5, -1, 0)),
  new Triangle(new Vector3(0.5, 1, 0), new Vector3(-0.5, 1, 0), new Vector3(0, 0.5, 1)),
  new Triangle(new Vector3(-0.5, 1, 0), new Vector3(0.5, 1, 0), new Vector3(0, 0.5, -1)),
  new Triangle(new Vector3(0, -0.5, -1), new Vector3(0, 0.5, -1), new Vector3(1, 0, -0.5)),
  new Triangle(new Vector3(0, 0.5, -1), new Vector3(0, -0.5, -1), new Vector3(-1, 0, -0.5)),
  new Triangle(new Vector3(0.5, -1, 0), new Vector3(-0.5, -1, 0), new Vector3(0, -0.5, -1)),
  new Triangle(new Vector3(-0.5, -1, 0), new Vector3(0.5, -1, 0), new Vector3(0, -0.5, 1)),
  new Triangle(new Vector3(0, 0.5, 1), new Vector3(0, -0.5, 1), new Vector3(1, 0, 0.5)),
  new Triangle(new Vector3(0, -0.5, 1), new Vector3(0, 0.5, 1), new Vector3(-1, 0, 0.5)),
  new Triangle(new Vector3(0.5, 1, 0), new Vector3(1, 0, -0.5), new Vector3(0, 0.5, -1)),
  new Triangle(new Vector3(1, 0, 0.5), new Vector3(0.5, 1, 0), new Vector3(0, 0.5, 1)),
  new Triangle(new Vector3(-1, 0, -0.5), new Vector3(-0.5, 1, 0), new Vector3(0, 0.5, -1)),
  new Triangle(new Vector3(-0.5, 1, 0), new Vector3(-1, 0, 0.5), new Vector3(0, 0.5, 1)),
  new Triangle(new Vector3(1, 0, -0.5), new Vector3(0.5, -1, 0), new Vector3(0, -0.5, -1)),
  new Triangle(new Vector3(0.5, -1, 0), new Vector3(1, 0, 0.5), new Vector3(0, -0.5, 1)),
  new Triangle(new Vector3(-1, 0, -0.5), new Vector3(0, -0.5, -1), new Vector3(-0.5, -1, 0)),
  new Triangle(new Vector3(-1, 0, 0.5), new Vector3(-0.5, -1, 0), new Vector3(0, -0.5, 1)),
]

it('should build root box', () => {
  expect(getMinPoint(objects)).toEqual(new Vector3(-1, -1, -1))
  expect(getMaxPoint(objects)).toEqual(new Vector3(1, 1, 1))
})

it('should build octree with depth 2', () => {
  let octree = new Octree(
    {
      leafCapacity: 19,
      maxDepth: 2,
      node: {
        type: 'leaf',
        box: new Box3(getMinPoint(objects), getMaxPoint(objects)),
        triangles: [],
        depth: 1,
      }
    }
  )

  for (let object of objects) {
    octree = octree.insertTriangle(object)
  }

  expect(octree.node.type).toEqual('internal_node')
  octree.node.children.forEach(child => {
    expect(child.node.type).toEqual('leaf')
    expect(child.node.triangles.length).toEqual(10)
  })
})

it('should build octree with depth 3', () => {
  let octree = new Octree(
    {
      leafCapacity: 9,
      maxDepth: 3,
      node: {
        type: 'leaf',
        box: new Box3(getMinPoint(objects), getMaxPoint(objects)),
        triangles: [],
        depth: 1,
      }
    }
  )

  for (let object of objects) {
    octree = octree.insertTriangle(object)
  }

  expect(octree.node.type).toEqual('internal_node')

  octree.node.children.forEach(child => {
    expect(child.node.type).toEqual('internal_node')
    child.node.children.forEach(child => {
      expect(child.node.type).toEqual('leaf')
    })
  })
})

it('should find intersection point', () => {
  const target = new Triangle(new Vector3(-1, 1, 1), new Vector3(1, -1, 1), new Vector3(1, 1, 0.1))

  const objects = [
    new Triangle(new Vector3(-1, 1, -1), new Vector3(-1, -1, -1), new Vector3(1, -1, -1)),
    new Triangle(new Vector3(-1, 1, 1), new Vector3(1, -1, 1), new Vector3(1, 1, 1)),
    new Triangle(new Vector3(-1, 1, 1), new Vector3(1, -1, 1), new Vector3(1, 1, 0.9)),
    new Triangle(new Vector3(-1, 1, 1), new Vector3(1, -1, 1), new Vector3(1, 1, 0.8)),
    new Triangle(new Vector3(-1, 1, 1), new Vector3(1, -1, 1), new Vector3(1, 1, 0.7)),
    new Triangle(new Vector3(-1, 1, 1), new Vector3(1, -1, 1), new Vector3(1, 1, 0.6)),
    new Triangle(new Vector3(-1, 1, 1), new Vector3(1, -1, 1), new Vector3(1, 1, 0.5)),
    new Triangle(new Vector3(-1, 1, 1), new Vector3(1, -1, 1), new Vector3(1, 1, 0.4)),
    new Triangle(new Vector3(-1, 1, 1), new Vector3(1, -1, 1), new Vector3(1, 1, 0.3)),
    new Triangle(new Vector3(-1, 1, 1), new Vector3(1, -1, 1), new Vector3(1, 1, 0.2)),
    target,
  ]

  let octree = new Octree(
    {
      leafCapacity: 4,
      maxDepth: 4,
      node: {
        type: 'leaf',
        box: new Box3(getMinPoint(objects), getMaxPoint(objects)),
        triangles: [],
        depth: 1,
      }
    }
  )

  for (let object of objects) {
    octree = octree.insertTriangle(object)
  }

  const line = new Ray(new Vector3(0, 0, 0), new Vector3(1, 1, 1))

  const intersection = octree.findIntersectionPoint(line)

  expect(intersection).toEqual(new Vector3(0.5263157894736842, 0.5263157894736842, 0.5263157894736842))
})
