const radiansToVector = exports.radiansToVector = (radians, multiplier = 1.0) => {
  return {
    x: Math.cos(radians) * multiplier,
    y: Math.sin(radians) * multiplier
  }
}

const degreesToRadians = exports.degreesToRadians = (degrees) => {
  return (degrees - 90) * (Math.PI / 180)
}

exports.degreesToVector = (degrees, multiplier) => {
  const radians = degreesToRadians(degrees)

  return radiansToVector(radians, multiplier)
}

exports.vectorToDegrees = (vector) => {
  return 90 + (Math.atan2(vector.y, vector.x) * 180 / Math.PI)
}

exports.vectorToDistance = (vector) => {
  return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
}
