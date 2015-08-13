module.exports = Map;

function Map(width, height) {
  this._width = width;
  this._height = height;
}

Map.prototype.width = function() {
  return this._width;
}

Map.prototype.height = function() {
  return this._height;
}

Map.prototype.boundingBox = function() {
  return {
    topLeft: { x: 0, y: 0 },
    bottomRight: { x: this.width(), y: this.height() }
  };
}
