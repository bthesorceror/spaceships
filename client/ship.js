var keys         = require('arcade_keys').keys;
var EventEmitter = require('events').EventEmitter;
var inherits     = require('util').inherits;
var boundingBox  = require('./bounding_box');
var intersects    = require('./intersects');

function convertToRadians(degrees) {
  return (degrees - 90) * (Math.PI / 180);
}

function degreesToVector(degrees, multiplier) {
  var radians = convertToRadians(degrees);
  return radiansToVector(radians, multiplier);
}

function vectorToDistance(vector) {
  return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
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

function Ship(ak) {
  EventEmitter.call(this);
  this.ak            = ak;
  this.position      = { x: 0, y: 0 };
  this.rotation      = 0;
  this.rotationSpeed = 3;
  this.vector = { x: 0, y: 0 };
  this.bullets = [];

  this.fireFrames = 0;
  this.fireFrameLimit = 30;

  this.maxBullets = 25;
  this.maxBulletDistance = 1000;
}

Ship.prototype.markBulletForRemoval = function(bullet) {
  bullet.destroy = true;
}

Ship.prototype.purgeBullets = function() {
  this.bullets = this.bullets.filter(function(bullet) {
    return !bullet.destroy;
  });
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
  return degreesToVector(this.rotation, 0.10);
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

Ship.prototype.drawShip = function(screen) {
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

Ship.prototype.drawFlame = function(screen) {
  var self = this;

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

Ship.prototype.drawCollision = function(screen) {
  this.drawShip(screen);
}

Ship.prototype.draw = function(screen) {
  this.drawShip(screen);

  if (this.powered) {
    this.drawFlame(screen);
  }

  this.bullets.forEach(function(bullet) {
    bullet.draw(screen);
  });
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

Ship.prototype.canFire = function() {
  return this.bullets.length < this.maxBullets &&
    this.fireFrames > this.fireFrameLimit;
}

Ship.prototype.fire = function() {
  if (this.canFire()) {
    this.fireFrames = 0;
    var vector = degreesToVector(this.rotation, 7.5);

    var position = { x: this.position.x, y: this.position.y };
    position.x += vector.x;
    position.y += vector.y;

    vector.x += this.vector.x;
    vector.y += this.vector.y;

    this.bullets.push(
      new Bullet(
        position.x,
        position.y,
        vector,
        this.rotation)
    );
  }
}

Ship.prototype.updateFiring = function() {
  this.fireFrames += 1;
  if (this.ak.isPressed(keys.space)) {
    this.fire();
  }
}

Ship.prototype.update = function() {
  this.updateRotation();
  this.updateMovement();
  this.updateFiring();

  this.bullets.forEach(function(bullet) {
    bullet.update();
  });

  var self = this;
  this.bullets = this.bullets.filter(function(bullet) {
    return bullet.distance < self.maxBulletDistance;
  });

  this.move();
}

Ship.prototype.move = function() {
  this.position.x += this.vector.x;
  this.position.y += this.vector.y;
  this.emit('positionChanged', this.position);
}
