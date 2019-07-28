const boundingBox = require('./bounding_box')
const Bullet = require('./bullet')

const { EventEmitter } = require('events')
const { keys } = require('arcade_keys')
const { degreesToVector } = require('./utils')

module.exports = class Ship extends EventEmitter {
  constructor (ak) {
    super()

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

  isActive () {
    return this.state === 'active'
  }

  markAsDestroyed () {
    this.state = 'exploding'
    this.explodingFrameCount = 0
  }

  markBulletForRemoval (bullet) {
    bullet.destroy = true
  }

  purgeBullets () {
    this.bullets = this.bullets.filter((bullet) => {
      return !bullet.destroy
    })
  }

  setPosition (x, y) {
    this.position = { x, y }
  }

  applyVector (vector) {
    this.vector.x += vector.x
    this.vector.y += vector.y
  }

  movementVector () {
    return degreesToVector(this.rotation, 0.10)
  }

  boundingBox () {
    return boundingBox(this)
  }

  width () {
    return 70
  }

  height () {
    return 70
  }

  drawShip (screen) {
    const { position, rotation } = this

    screen.draw(function (context) {
      const pos = this.getTranslatedPosition(position)

      context.fillStyle = '#00F'
      context.translate(pos.x, pos.y)
      context.beginPath()
      context.rotate(rotation * (Math.PI / 180))
      context.moveTo(0, -20)
      context.lineTo(20, 20)
      context.lineTo(0, 10)
      context.lineTo(-20, 20)
      context.closePath()
      context.fill()
    })
  }

  drawFlame (screen) {
    const { position, rotation } = this

    screen.draw(function (context) {
      var pos = this.getTranslatedPosition(position)

      context.fillStyle = '#FF8C00'
      context.translate(pos.x, pos.y)

      context.rotate(rotation * (Math.PI / 180))

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

  drawCollision (screen) {
    if (this.state === 'active') {
      this.drawShip(screen)
    }
  }

  drawExploding (screen) {
    const { position, explodingFrameCount } = this

    const lineWidth = 10
    const size = Math.floor(explodingFrameCount / 5) * 2

    screen.draw(function (context) {
      var pos = this.getTranslatedPosition(position)

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

  drawActive (screen) {
    this.drawShip(screen)

    if (this.powered) {
      this.drawFlame(screen)
    }

    this.bullets.forEach(function (bullet) {
      bullet.draw(screen)
    })
  }

  draw (screen) {
    switch (this.state) {
      case 'exploding':
        return this.drawExploding(screen)
      case 'active':
        return this.drawActive(screen)
    }
  }

  positionWasUpdated () {
    this.emit('positionChanged', this.position)
  }

  updateRotation () {
    if (this.ak.isPressed(keys.left)) {
      this.rotation -= this.rotationSpeed
    }

    if (this.ak.isPressed(keys.right)) {
      this.rotation += this.rotationSpeed
    }

    this.rotation %= 360
  }

  updateMovement () {
    this.powered = this.ak.isPressed(keys.up)

    if (this.powered) {
      this.applyVector(this.movementVector())
    }
  }

  canFire () {
    return this.bullets.length < this.maxBullets &&
    this.fireFrames > this.fireFrameLimit
  }

  fire () {
    if (!this.canFire()) {
      return
    }

    this.fireFrames = 0

    const vector = degreesToVector(this.rotation, 7.5)
    const position = { x: this.position.x, y: this.position.y }

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

  updateFiring () {
    this.fireFrames += 1
    if (this.ak.isPressed(keys.space)) {
      this.fire()
    }
  }

  updateActive () {
    this.updateRotation()
    this.updateMovement()
    this.updateFiring()

    this.bullets.forEach((bullet) => {
      bullet.update()
    })

    this.bullets = this.bullets.filter((bullet) => {
      return bullet.distance < this.maxBulletDistance
    })

    this.move()
  }

  updateExploding () {
    if (this.explodingFrameCount < 50) {
      this.explodingFrameCount++
    } else {
      this.state = 'exploded'
    }
  }

  update () {
    switch (this.state) {
      case 'exploding':
        this.updateExploding()
        break
      case 'active':
        this.updateActive()
        break
    }
  }

  move () {
    this.position.x += this.vector.x
    this.position.y += this.vector.y
    this.emit('positionChanged', this.position)
  }
}
