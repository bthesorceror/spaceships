module.exports = vectorToDistance

function vectorToDistance (vector) {
  return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
}
