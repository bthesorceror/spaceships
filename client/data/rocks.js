const _ = require('lodash')
const Rock = require('../rock')
const colors = ['#F00', '#FF0', '#F0F', '#CCC']

function createRockData (maxWidth, maxHeight) {
  return {
    x: _.random(0, maxWidth),
    y: _.random(0, maxHeight),
    color: _.sample(colors),
    rotation: 0,
    rotationSpeed: 2,
    size: 40,
    vector: {
      x: _.random(-2, 2),
      y: _.random(-2, 2)
    }
  }
}

module.exports = function (count, maxWidth, maxHeight) {
  return _.times(count, function () {
    return _.tap(new Rock(), function (rock) {
      let data = createRockData(maxWidth, maxHeight)

      rock.setAttributesFromData(data)
    })
  })
}
