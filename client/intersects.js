var boundingBox = require('./bounding_box');

module.exports = intersects;

function intersects(obj1, obj2) {
  var bbox1 = obj1.boundingBox();
  var bbox2 = obj2.boundingBox();

  if (bbox2.topLeft.x > bbox1.bottomRight.x) return false;
  if (bbox2.topLeft.y > bbox1.bottomRight.y) return false;
  if (bbox2.bottomRight.x < bbox1.topLeft.x) return false;
  if (bbox2.bottomRight.y < bbox1.topLeft.y) return false;

  return true;
}

