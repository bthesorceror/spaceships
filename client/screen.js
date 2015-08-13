module.exports = Screen;

function Screen(canvas, map) {
  this.canvas     = canvas;
  this.context    = canvas.getContext('2d');
  this.centeredOn = { x: 0, y: 0 };
  this.maxWidth   = !!map ? map.width() : 0;
  this.maxHeight  = !!map ? map.height() : 0;
}

Screen.prototype.halfWidth = function() {
  return this.getWidth() / 2;
}

Screen.prototype.halfHeight = function() {
  return this.getHeight() / 2;
}

Screen.prototype.focusOn = function(obj) {
  var x = obj.position.x;
  var y = obj.position.y;

  if (x < this.halfWidth()) {
    x = this.halfWidth();
  } else if (x > this.maxWidth - this.halfWidth()) {
    x = this.maxWidth - this.halfWidth();
  }

  if (y < this.halfHeight()) {
    y = this.halfHeight();
  } else if (y > this.maxHeight - this.halfHeight()) {
    y = this.maxHeight - this.halfHeight();
  }

  this.setCenteredOn(x, y);
}

Screen.prototype.clear = function() {
  this.context.clearRect(
    0, 0, this.canvas.width, this.canvas.height);
}

Screen.prototype.getPixelData = function() {
  return this.context.getImageData(
    0, 0, this.getWidth(), this.getHeight()).data;
}

Screen.prototype.setHeight = function(height) {
  this.canvas.setAttribute('height', height);
}

Screen.prototype.getHeight = function() {
  return this.canvas.height;
}

Screen.prototype.setWidth = function(width) {
  this.canvas.setAttribute('width', width);
}

Screen.prototype.getWidth = function() {
  return this.canvas.width;
}

Screen.prototype.setDimensions = function(width, height) {
  this.setWidth(width);
  this.setHeight(height);
}

Screen.prototype.getCenter = function() {
  var centerX = this.canvas.width / 2;
  var centerY = this.canvas.height / 2;

  return { x: centerX, y: centerY };
}

Screen.prototype.setCenteredOn = function(x, y) {
  this.centeredOn.x = x;
  this.centeredOn.y = y;
}

Screen.prototype.changeCenteredOn = function(deltaX, deltaY) {
  this.centeredOn.x += deltaX;
  this.centeredOn.y += deltaY;
}

Screen.prototype.getCenteredOn = function() {
  return this.centeredOn;
}

Screen.prototype.boundingBox = function() {
  var minX = this.centeredOn.x - (this.getWidth() / 2);
  var minY = this.centeredOn.y - (this.getHeight() / 2);

  var maxX = this.centeredOn.x + (this.getWidth() / 2);
  var maxY = this.centeredOn.y + (this.getHeight() / 2);

  return {
    topLeft: {x: minX, y: minY},
    bottomRight: {x: maxX, y: maxY}
  }
}

Screen.prototype.getTranslatedPosition = function(original) {
  var center = this.getCenter();

  var x = center.x + (original.x - this.centeredOn.x);
  var y = center.y + (original.y - this.centeredOn.y);

  return { x: x, y: y };
}

Screen.prototype.draw = function(cb) {
  this.context.save();
  cb.call(this, this.context);
  this.context.restore();
}
