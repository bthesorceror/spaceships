const { EventEmitter } = require('events')

module.exports = class Screen extends EventEmitter {
  constructor (canvas, map) {
    super()
    this.map = map
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.centeredOn = { x: 0, y: 0 }
  }

  focusOn (obj) {
    let { x, y } = obj.position

    x = Math.min(Math.max(x, this.halfWidth), this.maxWidth - this.halfWidth)
    y = Math.min(Math.max(y, this.halfHeight), this.maxHeight - this.halfHeight)

    this.centeredOn = { x, y }
  }

  clear () {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  draw (callback) {
    this.context.save()
    callback.call(this, this.context)
    this.context.restore()
  }

  getPixelData () {
    return this.context.getImageData(
      0, 0,
      this.width, this.height
    ).data
  }

  get maxWidth () {
    return this.map ? this.map.width() : 0
  }

  get maxHeight () {
    return this.map ? this.map.height() : 0
  }

  get width () {
    return this.canvas.width
  }

  get height () {
    return this.canvas.height
  }

  set height (val) {
    this.canvas.setAttribute('height', val)
  }

  set width (val) {
    this.canvas.setAttribute('width', val)
  }

  get halfWidth () {
    return this.width / 2.0
  }

  get halfHeight () {
    return this.height / 2.0
  }

  get center () {
    const x = this.canvas.width / 2
    const y = this.canvas.height / 2

    return { x, y }
  }

  setDimensions (width, height) {
    this.height = height
    this.width = width

    this.emit('resize')
  }

  getTranslatedPosition (original) {
    const x = this.center.x + (original.x - this.centeredOn.x)
    const y = this.center.y + (original.y - this.centeredOn.y)

    return { x, y }
  }

  boundingBox () {
    const minX = this.centeredOn.x - (this.width / 2)
    const minY = this.centeredOn.y - (this.height / 2)

    const maxX = this.centeredOn.x + (this.width / 2)
    const maxY = this.centeredOn.y + (this.height / 2)

    return {
      topLeft: { x: minX, y: minY },
      bottomRight: { x: maxX, y: maxY }
    }
  }
}
