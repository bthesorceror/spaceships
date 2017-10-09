module.exports = function (obj) {
  var minX = obj.position.x - (obj.width() / 2)
  var minY = obj.position.y - (obj.height() / 2)

  var maxX = obj.position.x + (obj.width() / 2)
  var maxY = obj.position.y + (obj.height() / 2)

  return {
    topLeft: {x: minX, y: minY},
    bottomRight: {x: maxX, y: maxY}
  }
}
