var Rock = require('../rock');

function getRandomWithin(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomItem(array) {
  return array[getRandomInt(array.length)];
}

function randomRockColor() {
  var colors = ['#F00', '#FF0', '#F0F', '#CCC'];
  return getRandomItem(colors);
}

function createRockData(maxWidth, maxHeight) {
  var x = getRandomInt(maxWidth);
  var y = getRandomInt(maxHeight);

  var deltaX = getRandomWithin(-2, 2);
  var deltaY = getRandomWithin(-2, 2);

  return {
    x: x,
    y: y,
    color: randomRockColor(),
    rotation: 0,
    rotationSpeed: 2,
    size: 40,
    vector: { x: deltaX, y: deltaY }
  };
}

module.exports = function(count, maxWidth, maxHeight) {
  var rocks = [];
  for (var i = 0; i < count; i++) {
    var data = createRockData(maxWidth, maxHeight);
    var rock = new Rock();

    rock.setAttributesFromData(data);
    rocks.push(rock);
  }
  return rocks;
};
