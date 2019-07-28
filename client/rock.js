var boundingBox = require('./bounding_box')
var intersects = require('./intersects')

const { degreesToVector, vectorToDegrees, vectorToDistance } = require('./utils')

module.exports = class Rock {
  constructor () {
    this.position = { x: 0, y: 0 }
    this.color = '#FFF'
    this.rotation = 0
    this.rotationSpeed = 0
    this.size = 10
    this.vector = { x: 0, y: 0 }
  }

  setAttributesFromData (data) {
    this.position = { x: data.x, y: data.y }
    this.color = data.color
    this.rotation = data.rotation
    this.rotationSpeed = data.rotationSpeed
    this.size = data.size
    this.vector = data.vector
  }

  fromBulletImpact () {
    const {
      position: { x, y },
      size,
      color,
      rotation,
      rotationSpeed
    } = this

    if (size <= 10) return []

    const rock1 = new Rock()
    const rock2 = new Rock()

    const degrees = vectorToDegrees(this.vector)
    const distance = vectorToDistance(this.vector)

    const vector1 = degreesToVector(degrees + 52, distance)
    const vector2 = degreesToVector(degrees - 52, distance)

    rock1.position = {
      x: x + (vector1.x * size / 2),
      y: y + (vector1.y * size / 2)
    }

    rock2.position = {
      x: x + (vector2.x * size / 2),
      y: y + (vector2.y * size / 2)
    }

    rock2.color = rock1.color = color
    rock2.rotation = rock1.rotation = rotation
    rock2.rotationSpeed = rock1.rotationSpeed = rotationSpeed
    rock2.size = rock1.size = size / 2

    rock1.vector = vector1
    rock2.vector = vector2

    return [rock1, rock2]
  }

  width () {
    return this.size * 3
  }

  height () {
    return this.size * 3
  }

  boundingBox () {
    return boundingBox(this)
  }

  drawCollision (screen) {
    this.draw(screen)
  }

  draw (screen) {
    const { color, size, rotation, position } = this

    if (!intersects(this, screen)) return

    screen.draw(function (context) {
      var pos = this.getTranslatedPosition(position)

      context.fillStyle = color
      context.translate(pos.x, pos.y)
      context.beginPath()

      context.rotate(rotation * (Math.PI / 180))

      context.moveTo(-(size / 2), -size)
      context.lineTo(size / 2, -size)
      context.lineTo(size, -size / 2)
      context.lineTo(size, size / 2)
      context.lineTo(size / 2, size)
      context.lineTo(-(size / 2), size)
      context.lineTo(-size, size / 2)
      context.lineTo(-size, -size / 2)

      context.closePath()
      context.fill()
    })
  }

  move () {
    this.position.x += this.vector.x
    this.position.y += this.vector.y
  }

  rotate () {
    this.rotation = (this.rotation + this.rotationSpeed) % 360
  }

  update () {
    this.rotate()
    this.move()
  }
}
