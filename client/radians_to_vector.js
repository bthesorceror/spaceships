module.exports = radiansToVector

function radiansToVector (radians, multiplier) {
  if (!multiplier) { multiplier = 1.0 }

  return {
    x: Math.cos(radians) * multiplier,
    y: Math.sin(radians) * multiplier
  }
}
