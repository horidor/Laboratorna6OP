const fs = require('fs')
const OBJFile = require('obj-file-parser')
const { Triangle, Vector3 } = require('three')

exports.getTriangles = (file) => {
  const fileContents = fs.readFileSync(`${__dirname}/${file}`).toString('utf-8')

  const objFile = new OBJFile(fileContents)

  const objFileResult = objFile.parse()

  const model = objFileResult.models[0]

  return model.faces.map(face => {
    const a = model.vertices[face.vertices[0].vertexIndex - 1]
    const b = model.vertices[face.vertices[1].vertexIndex - 1]
    const c = model.vertices[face.vertices[2].vertexIndex - 1]

    return new Triangle(new Vector3(a.x, a.y, a.z), new Vector3(b.x, b.y, b.z), new Vector3(c.x, c.y, c.z))
  })
}
