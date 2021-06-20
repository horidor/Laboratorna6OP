const { Box3, Vector3 } = require('three')
const { partition } = require('./partition')

let i = 0

exports.Octree = class Octree {
  constructor({ leafCapacity, maxDepth, node }) {
    this.leafCapacity = leafCapacity
    this.maxDepth = maxDepth
    this.node = node
  }

  insertTriangle(triangle) {
    if (this.node.type === 'leaf') {
      const newTriangles = [...this.node.triangles, triangle]

      if (this.node.triangles.length < this.leafCapacity || this.node.depth >= this.maxDepth) {
        return new Octree({
          leafCapacity: this.leafCapacity,
          maxDepth: this.maxDepth,
          node: {
            type: 'leaf',
            box: this.node.box,
            triangles: newTriangles,
            depth: this.node.depth,
          }
        })
      }

      // When more than allowed, transform leaf into internal node by splitting space in 8 subspaces.
      const boxes = partition(this.node.box)

      const internalNode = new Octree({
        leafCapacity: this.leafCapacity,
        maxDepth: this.maxDepth,
        node: {
          type: 'internal_node',
          box: this.node.box,
          children: boxes.map(box => new Octree({
            leafCapacity: this.leafCapacity,
            maxDepth: this.maxDepth,
            node: {
              type: 'leaf',
              box: box,
              triangles: [],
              depth: this.node.depth + 1,
            }
          }))
        }
      })

      // Insert all triangles to the internal node
      let newTree = internalNode
      for (let newTriangle of newTriangles) {
        newTree = internalNode.insertTriangle(newTriangle)
      }
      return newTree
    }

    // console.log(triangle)

    // Else if pushing to internal node
    return new Octree({
      leafCapacity: this.leafCapacity,
      maxDepth: this.maxDepth,
      node: {
        type: 'internal_node',
        box: this.node.box,
        children: this.node.children.map(childTree => {
          if (childTree.node.box.intersectsTriangle(triangle)) {
            return childTree.insertTriangle(triangle)
          }
          return childTree
        })
      }
    })
  }

  // Returns Vector3 | null
  findIntersectionPoint(ray) {

    // Returns the closest intersection point for the given node.
    const findIntersectionPointRec = (node, point) => {
      // This line is what saves us a lot of computations.
      // When the line doesn't intersect the outer box, skip all the triangles inside that box.
      if (!ray.intersectsBox(node.box)) {
        return
      }

      if (node.type === 'internal_node') {
        // Go through all child nodes and get the closest intersection.
        for (const childTree of node.children) {
          findIntersectionPointRec(childTree.node, point)
        }
      } else {
        // Go through all triangles of current node and get the closest intersection.
        for (const triangle of node.triangles) {
          const intersection = ray.intersectTriangle(triangle.a, triangle.b, triangle.c, false, new Vector3())

          if (intersection !== null) {
            const distance = intersection.distanceTo(ray.origin)
            if (distance < point.distance) {
              point.intersectionPoint = intersection
              point.distance = distance
            }
          }
        }
      }
    }

    const result = {
      intersectionPoint: new Vector3(Infinity, Infinity, Infinity),
      distance: Infinity,
    }

    findIntersectionPointRec(this.node, result)

    return result.distance === Infinity ? null : result.intersectionPoint
  }
}
