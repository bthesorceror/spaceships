const boundingBox = require('./bounding_box')
const Bullet = require('./bullet')

const { EventEmitter } = require('events')
const { inherits } = require('util')
const { keys } = require('arcade_keys')
const { degreesToVector } = require('./utils')

module.exports = Ship

inherits(Ship, EventEmitter)

function Ship (ak) {
  EventEmitter.call(this)
  this.ak = ak
  this.position = { x: 0, y: 0 }
  this.rotation = 0
  this.rotationSpeed = 3
  this.vector = { x: 0, y: 0 }
  this.bullets = []
  this.state = 'active'

  this.fireFrames = 0
  this.fireFrameLimit = 30

  this.maxBullets = 25
  this.maxBulletDistance = 1000
}

Ship.prototype.isActive = function () {
  return this.state === 'active'
}

Ship.prototype.markAsDestroyed = function () {
  this.state = 'exploding'
  this.explodingFrameCount = 0
}

Ship.prototype.markBulletForRemoval = function (bullet) {
  bullet.destroy = true
}

Ship.prototype.purgeBullets = function () {
  this.bullets = this.bullets.filter(function (bullet) {
    return !bullet.destroy
  })
}

Ship.prototype.setPosition = function (x, y) {
  this.position.x = x
  this.position.y = y
}

Ship.prototype.applyVector = function (vector) {
  this.vector.x += vector.x
  this.vector.y += vector.y
}

Ship.prototype.movementVector = function () {
  return degreesToVector(this.rotation, 0.10)
}

Ship.prototype.boundingBox = function () {
  return boundingBox(this)
}

Ship.prototype.width = function () {
  return 70
}

Ship.prototype.height = function () {
  return 70
}

Ship.prototype.drawShip = function (screen) {
  var self = this

  screen.draw(function (context) {
    var pos = this.getTranslatedPosition(self.position)

    context.fillStyle = '#00F'
    context.translate(pos.x, pos.y)
    context.beginPath()
    context.rotate(self.rotation * (Math.PI / 180))
    context.moveTo(0, -20)
    context.lineTo(20, 20)
    context.lineTo(0, 10)
    context.lineTo(-20, 20)
    context.closePath()
    context.fill()
  })
}

Ship.prototype.drawFlame = function (screen) {
  var self = this

  screen.draw(function (context) {
    var pos = this.getTranslatedPosition(self.position)

    context.fillStyle = '#FF8C00'
    context.translate(pos.x, pos.y)

    context.rotate(self.rotation * (Math.PI / 180))

    context.beginPath()
    context.moveTo(0, 10)
    context.lineTo(10, 15)
    context.lineTo(10, 30)
    context.lineTo(0, 25)
    context.lineTo(-10, 30)
    context.lineTo(-10, 15)
    context.closePath()

    context.fill()
  })
}

Ship.prototype.drawCollision = function (screen) {
  if (this.state === 'active') { this.drawShip(screen) }
}

Ship.prototype.drawExploding = function (screen) {
  var self = this
  var lineWidth = 10
  var size = Math.floor(self.explodingFrameCount / 5) * 2

  screen.draw(function (context) {
    var pos = this.getTranslatedPosition(self.position)

    context.strokeStyle = '#FFFF00'
    context.lineWidth = lineWidth
    context.translate(pos.x, pos.y)
    context.beginPath()
    context.moveTo(-size, -size)
    context.lineTo(size, -size)
    context.lineTo(size, size)
    context.lineTo(-size, size)
    context.closePath()
    context.stroke()
  })
}

Ship.prototype.drawActive = function (screen) {
  this.drawShip(screen)

  if (this.powered) {
    this.drawFlame(screen)
  }

  this.bullets.forEach(function (bullet) {
    bullet.draw(screen)
  })
}

Ship.prototype.draw = function (screen) {
  if (this.state === 'exploding') { return this.drawExploding(screen) } else if (this.state === 'active') { return this.drawActive(screen) }
}

Ship.prototype.positionWasUpdated = function () {
  this.emit('positionChanged', this.position)
}

Ship.prototype.updateRotation = function () {
  if (this.ak.isPressed(keys.left)) {
    this.rotation -= this.rotationSpeed
  }

  if (this.ak.isPressed(keys.right)) {
    this.rotation += this.rotationSpeed
  }

  this.rotation %= 360
}

Ship.prototype.updateMovement = function () {
  this.powered = this.ak.isPressed(keys.up)

  if (this.powered) {
    this.applyVector(this.movementVector())
  }
}

Ship.prototype.canFire = function () {
  return this.bullets.length < this.maxBullets &&
    this.fireFrames > this.fireFrameLimit
}

Ship.prototype.fire = function () {
  if (this.canFire()) {
    this.fireFrames = 0
    var vector = degreesToVector(this.rotation, 7.5)

    var position = { x: this.position.x, y: this.position.y }
    position.x += vector.x
    position.y += vector.y

    vector.x += this.vector.x
    vector.y += this.vector.y

    this.bullets.push(
      new Bullet(
        position.x,
        position.y,
        vector,
        this.rotation)
    )
  }
}

Ship.prototype.updateFiring = function () {
  this.fireFrames += 1
  if (this.ak.isPressed(keys.space)) {
    this.fire()
  }
}

Ship.prototype.updateActive = function () {
  this.updateRotation()
  this.updateMovement()
  this.updateFiring()

  this.bullets.forEach(function (bullet) {
    bullet.update()
  })

  var self = this
  this.bullets = this.bullets.filter(function (bullet) {
    return bullet.distance < self.maxBulletDistance
  })

  this.move()
}

Ship.prototype.updateExploding = function () {
  if (this.explodingFrameCount < 50) { this.explodingFrameCount++ } else { this.state = 'exploded' }
}

Ship.prototype.update = function () {
  if (this.state === 'exploding') { this.updateExploding() } else if (this.state === 'active') { this.updateActive() }
}

Ship.prototype.move = function () {
  this.position.x += this.vector.x
  this.position.y += this.vector.y
  this.emit('positionChanged', this.position)
}
