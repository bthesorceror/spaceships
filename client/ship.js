var keys         = require('arcade_keys').keys;
var EventEmitter = require('events').EventEmitter;
var inherits     = require('util').inherits;
var boundingBox  = require('./bounding_box');

function convertToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function radiansToVector(radians, multiplier) {
  if (arguments.length < 2) { multiplier = 1.0; }

  return {
    x: Math.cos(radians) * multiplier,
    y: Math.sin(radians) * multiplier
  };
}

module.exports = Ship;

inherits(Ship, EventEmitter);

function Ship(ak) {
  EventEmitter.call(this);
  this.ak            = ak;
  this.position      = { x: 0, y: 0 };
  this.rotation      = 0;
  this.rotationSpeed = 3;
  this.vector = { x: 0, y: 0 };
}

Ship.prototype.setPosition = function(x, y) {
  this.position.x = x;
  this.position.y = y;
}

Ship.prototype.applyVector = function(vector) {
  this.vector.x += vector.x;
  this.vector.y += vector.y;
}

Ship.prototype.movementVector = function() {
  var radians = convertToRadians(this.rotation - 90);
  return radiansToVector(radians, 0.10);
}

Ship.prototype.boundingBox = function() {
  return boundingBox(this);
}

Ship.prototype.width = function() {
  return 70;
}

Ship.prototype.height = function() {
  return 70;
}

var collision = require('./collision');
Ship.prototype.collidesWithRock = function(rock) {
  return collision(this, rock, { skipFlame: true });
}

Ship.prototype.draw = function(screen, options) {
  options = options || {};
  var self = this;

  screen.draw(function(context) {
    var pos = this.getTranslatedPosition(self.position);

    context.fillStyle = '#00F';
    context.translate(pos.x, pos.y);
    context.beginPath();
    context.rotate(self.rotation * (Math.PI / 180));
    context.moveTo(0, -20);
    context.lineTo(20, 20);
    context.lineTo(0, 10);
    context.lineTo(-20, 20);
    context.closePath();
    context.fill();
  });

  // Draw flame
  if (self.powered && !options.skipFlame) {
    screen.draw(function(context) {
      var pos = this.getTranslatedPosition(self.position);

      context.fillStyle = '#FF8C00';
      context.translate(pos.x, pos.y);

      context.rotate(self.rotation * (Math.PI / 180));

      context.beginPath();
      context.moveTo(0, 10);
      context.lineTo(10, 15);
      context.lineTo(10, 30);
      context.lineTo(0, 25);
      context.lineTo(-10, 30);
      context.lineTo(-10, 15);
      context.closePath();

      context.fill();
    });
  }
}

Ship.prototype.positionWasUpdated = function() {
  this.emit('positionChanged', this.position);
}

Ship.prototype.updateRotation = function() {
  if (this.ak.isPressed(keys.left)) {
    this.rotation -= this.rotationSpeed;
  }

  if (this.ak.isPressed(keys.right)) {
    this.rotation += this.rotationSpeed;
  }

  this.rotation %= 360;
}

Ship.prototype.updateMovement = function() {
  this.powered = this.ak.isPressed(keys.up);

  if (this.powered) {
    this.applyVector(this.movementVector())
  }
}

Ship.prototype.update = function() {
  this.updateRotation();
  this.updateMovement();

  this.move();
}

Ship.prototype.move = function() {
  this.position.x += this.vector.x;
  this.position.y += this.vector.y;
  this.emit('positionChanged', this.position);
}
