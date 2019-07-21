var convertToRadians = require('./convert_to_radians')
var radiansToVector = require('./radians_to_vector')

module.exports = degreesToVector

function degreesToVector (degrees, multiplier) {
  var radians = convertToRadians(degrees)
  return radiansToVector(radians, multiplier)
}
