var Screen     = require('./screen');
var intersects = require('./intersects');

module.exports = collision;

function activePixel(data, start) {
  return data[start] > 0 ||
    data[start+1] > 0 ||
    data[start+2];
}

function collision(obj1, obj2) {
  if (!intersects(obj1, obj2)) return false;

  var canvas = document.createElement('canvas');
  var screen = new Screen(canvas);

  screen.setCenteredOn(obj1.position.x, obj1.position.y);
  screen.setDimensions(obj1.width(), obj1.height());

  obj1.draw(screen);
  var pixelData1 = screen.getPixelData();

  screen.clear();

  obj2.draw(screen);
  var pixelData2 = screen.getPixelData();

  for (var i = 0; i < pixelData1.length; i += 4) {
    if (activePixel(pixelData1, i) &&
        activePixel(pixelData2, i)) {
      return true;
    }
  }

  return false;
}

