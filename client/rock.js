var boundingBox = require('./bounding_box');
var intersects = require('./intersects');

var degreesToVector  = require('./degrees_to_vector');
var vectorToDegrees  = require('./vector_to_degrees');
var vectorToDistance = require('./vector_to_distance');

module.exports = Rock;

function Rock() {
  this.position = { x: 0, y: 0 };
  this.color = '#FFF';
  this.rotation = 0;
  this.rotationSpeed = 0;
  this.size = 10;
  this.vector = { x: 0, y: 0 };
}

Rock.prototype.setAttributesFromData = function(data) {
  this.position      = { x: data.x, y: data.y };
  this.color         = data.color;
  this.rotation      = data.rotation;
  this.rotationSpeed = data.rotationSpeed;
  this.size          = data.size;
  this.vector        = data.vector;
}


Rock.prototype.fromImpact = function() {
  if (this.size <= 10) return [];

  var rock1 = new Rock();
  var rock2 = new Rock();

  var degrees  = vectorToDegrees(this.vector);
  var distance = vectorToDistance(this.vector);

  var vector1 = degreesToVector(degrees + 52, distance);
  var vector2 = degreesToVector(degrees - 52, distance);

  rock1.position = { x: this.position.x + (vector1.x * this.size / 2), y: this.position.y + (vector1.y * this.size / 2)};
  rock2.position = { x: this.position.x + (vector2.x * this.size / 2), y: this.position.y + (vector2.y * this.size / 2)};

  rock2.color         = rock1.color         = this.color;
  rock2.rotation      = rock1.rotation      = this.rotation;
  rock2.rotationSpeed = rock1.rotationSpeed = this.rotationSpeed;
  rock2.size          = rock1.size          = this.size / 2;

  rock1.vector = vector1;
  rock2.vector = vector2;

  return [rock1, rock2];
}

Rock.prototype.width = function() {
  return this.size * 3;
}

Rock.prototype.height = function() {
  return this.size * 3;
}

Rock.prototype.boundingBox = function() {
  return boundingBox(this);
}

Rock.prototype.drawCollision = function(screen) {
  this.draw(screen);
}

Rock.prototype.draw = function(screen) {
  var self = this;

  if (!intersects(this, screen)) return;

  screen.draw(function(context) {
    var pos = this.getTranslatedPosition(self.position);

    context.fillStyle = self.color;
    context.translate(pos.x, pos.y);
    context.beginPath();

    context.rotate(self.rotation * (Math.PI / 180));

    context.moveTo(-(self.size / 2), -self.size);
    context.lineTo(self.size / 2, -self.size);
    context.lineTo(self.size, -self.size / 2);
    context.lineTo(self.size, self.size / 2);
    context.lineTo(self.size / 2, self.size);
    context.lineTo(-(self.size / 2), self.size);
    context.lineTo(-self.size, self.size / 2);
    context.lineTo(-self.size, -self.size / 2);

    context.closePath();
    context.fill();
  });
}

Rock.prototype.move = function() {
  this.position.x += this.vector.x;
  this.position.y += this.vector.y;
}

Rock.prototype.rotate = function() {
  this.rotation = (this.rotation + this.rotationSpeed) % 360;
}

Rock.prototype.update = function() {
  this.rotate();
  this.move();
}
