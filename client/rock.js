module.exports = Rock;

function Rock() {
  this.position = { x: 0, y: 0 };
  this.color = '#FFF';
  this.rotation = 0;
  this.rotationSpeed = 0;
  this.size = 10;
}

Rock.prototype.setAttributesFromData = function(data) {
  this.position      = { x: data.x, y: data.y };
  this.color         = data.color;
  this.rotation      = data.rotation;
  this.rotationSpeed = data.rotationSpeed;
  this.size          = data.size;
}

Rock.prototype.width = function() {
  return this.size * 3;
}

Rock.prototype.height = function() {
  return this.size * 3;
}

Rock.prototype.draw = function(screen) {
  var self = this;

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

Rock.prototype.update = function() {
  this.rotation = (this.rotation + this.rotationSpeed) % 360;
}
