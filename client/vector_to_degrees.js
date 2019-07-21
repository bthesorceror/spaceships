module.exports = vectorToDegrees

function vectorToDegrees (vector) {
  return 90 + (Math.atan2(vector.y, vector.x) * 180 / Math.PI)
}
