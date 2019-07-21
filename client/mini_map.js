module.exports = MiniMap

function MiniMap (canvas, map) {
  this.canvas = canvas
  this.context = canvas.getContext('2d')
  this.percent = 0.25
  this.maxWidth = map.width()
  this.maxHeight = map.height()
}

MiniMap.prototype.setCanvasSize = function (screen) {
  this.canvas.width = screen.getWidth() * this.percent
  this.canvas.height = screen.getWidth() * this.percent
}

MiniMap.prototype.clear = function () {
  this.context.clearRect(0, 0,
    this.canvas.width, this.canvas.height)

  this.context.save()
  this.context.fillStyle = 'rgba(0,0,0,0.9)'
  this.context.fillRect(0, 0,
    this.canvas.width, this.canvas.height)
  this.context.restore()
}

MiniMap.prototype.drawScreenOutline = function (screen) {
  var adjustmentX = (this.canvas.width / this.maxWidth)
  var adjustmentY = (this.canvas.height / this.maxHeight)

  var x = adjustmentX * screen.centeredOn.x
  var y = adjustmentY * screen.centeredOn.y

  var width = adjustmentX * screen.getWidth() / 2
  var height = adjustmentX * screen.getHeight() / 2

  this.context.save()
  this.context.strokeStyle = '#00F'
  this.context.translate(x, y)

  this.context.beginPath()
  this.context.moveTo(-width, -height)
  this.context.lineTo(width, -height)
  this.context.lineTo(width, height)
  this.context.lineTo(-width, height)
  this.context.closePath()

  this.context.stroke()
  this.context.restore()
}

MiniMap.prototype.drawObject = function (obj, color) {
  var x = (this.canvas.width / this.maxWidth) * obj.position.x
  var y = (this.canvas.height / this.maxHeight) * obj.position.y

  this.context.save()
  this.context.fillStyle = color
  this.context.translate(x, y)

  this.context.beginPath()
  this.context.moveTo(-1, -1)
  this.context.lineTo(1, -1)
  this.context.lineTo(1, 1)
  this.context.lineTo(-1, 1)
  this.context.closePath()

  this.context.fill()
  this.context.restore()
}
