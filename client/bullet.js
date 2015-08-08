var intersects       = require('./intersects');
var boundingBox      = require('./bounding_box');
var vectorToDistance = require('./vector_to_distance');

module.exports = Bullet;

function Bullet(x, y, vector, rotation) {
  this.position = { x: x, y: y };
  this.vector   = vector;
  this.rotation = rotation;
  this.distance = 0;
}

Bullet.prototype.width = function() { return 10; }
Bullet.prototype.height = function() { return 10; }

Bullet.prototype.boundingBox = function() {
  return boundingBox(this);
}

Bullet.prototype.drawCollision = function(screen) {
  this.draw(screen);
}

Bullet.prototype.draw = function(screen) {
  if (!intersects(this, screen)) return;

  var self = this;

  screen.draw(function(context) {
    var pos = this.getTranslatedPosition(self.position);

    context.fillStyle = '#F0F';
    context.translate(pos.x, pos.y);
    context.rotate(self.rotation * (Math.PI / 180));

    context.beginPath();

    context.moveTo(-2, -5);
    context.lineTo(2, -5);
    context.lineTo(2, 5);
    context.lineTo(-2, 5);

    context.closePath();

    context.fill();
  });
}

Bullet.prototype.update = function() {
  this.distance += vectorToDistance(this.vector);
  this.position.x += this.vector.x;
  this.position.y += this.vector.y;
}
