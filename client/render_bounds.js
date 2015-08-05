var boundingBox = require('./bounding_box');

module.exports = renderBounds;

function renderBounds(obj, screen) {
  var box = boundingBox(obj);

  screen.draw(function(context) {
    var topLeft = this.getTranslatedPosition(box.topLeft);
    var bottomRight = this.getTranslatedPosition(box.bottomRight);

    context.strokeStyle = '#F00';

    context.beginPath();
    context.moveTo(topLeft.x, topLeft.y);
    context.lineTo(bottomRight.x, topLeft.y);
    context.lineTo(bottomRight.x, bottomRight.y);
    context.lineTo(topLeft.x, bottomRight.y);
    context.closePath();

    context.stroke();
  });
}

