module.exports = convertToRadians;

function convertToRadians(degrees) {
  return (degrees - 90) * (Math.PI / 180);
}

