module.exports = class MiniMap {
  constructor (map) {
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')

    this.canvas.id = 'miniMap'
    this.percent = 0.25
    this.maxWidth = map.width()
    this.maxHeight = map.height()
  }

  get adjustmentX () {
    return (this.canvas.width / this.maxWidth)
  }

  get adjustmentY () {
    return (this.canvas.height / this.maxHeight)
  }

  setCanvasSize (screen) {
    this.canvas.width = screen.getWidth() * this.percent
    this.canvas.height = screen.getWidth() * this.percent
  }

  clear () {
    this.context.clearRect(0, 0,
      this.canvas.width, this.canvas.height)

    this.context.save()
    this.context.fillStyle = 'rgba(0,0,0,0.8)'
    this.context.fillRect(0, 0,
      this.canvas.width, this.canvas.height)
    this.context.restore()
  }

  drawScreenOutline (screen) {
    var width = this.adjustmentX * screen.getWidth() / 2
    var height = this.adjustmentY * screen.getHeight() / 2

    this.context.save()
    this.context.strokeStyle = '#00F'
    this.translate(screen.centeredOn.x, screen.centeredOn.y)

    this.context.beginPath()
    this.context.moveTo(-width, -height)
    this.context.lineTo(width, -height)
    this.context.lineTo(width, height)
    this.context.lineTo(-width, height)
    this.context.closePath()

    this.context.stroke()
    this.context.restore()
  }

  drawObject (obj, color) {
    this.context.save()
    this.translate(obj.position.x, obj.position.y)

    this.context.fillStyle = color
    this.context.beginPath()
    this.context.moveTo(-1, -1)
    this.context.lineTo(1, -1)
    this.context.lineTo(1, 1)
    this.context.lineTo(-1, 1)
    this.context.closePath()
    this.context.fill()

    this.context.restore()
  }

  translate (x, y) {
    var newX = this.adjustmentX * x
    var newY = this.adjustmentY * y

    this.context.translate(newX, newY)
  }
}
