var keys         = require('arcade_keys').keys;
var EventEmitter = require('events').EventEmitter;
var inherits     = require('util').inherits;
var boundingBox  = require('./bounding_box');

module.exports = Ship;

inherits(Ship, EventEmitter);

function Ship(ak) {
  EventEmitter.call(this);
  this.ak            = ak;
  this.position      = { x: 0, y: 0 };
  this.rotation      = 0;
  this.rotationSpeed = 3;
}

Ship.prototype.setPosition = function(x, y) {
  this.position.x = x;
  this.position.y = y;
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

Ship.prototype.draw = function(screen) {
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
}

Ship.prototype.positionWasUpdated = function() {
  this.emit('positionChanged', this.position);
}

Ship.prototype.update = function() {
  if (this.ak.isPressed(keys.left)) {
    this.rotation -= this.rotationSpeed;
  }

  if (this.ak.isPressed(keys.right)) {
    this.rotation += this.rotationSpeed;
  }

  if (this.ak.isPressed(keys.up)) {
    this.position.y -= 3;
    this.positionWasUpdated();
  }

  if (this.ak.isPressed(keys.down)) {
    this.position.y += 3;
    this.positionWasUpdated();
  }

  this.rotation %= 360;
}
