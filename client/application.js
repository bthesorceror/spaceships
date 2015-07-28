var domready         = require('domready');
var arcadeKeys       = require('arcade_keys');
var FullscreenToggle = require('./fullscreen_toggle');

function setupToggle() {
  var button = document.querySelector('#fullscreenToggle');
  var toggle = new FullscreenToggle();

  toggle.on('on', function() {
    button.classList.add('exitFullscreen');
    button.classList.remove('enterFullscreen');
  });

  toggle.on('off', function() {
    button.classList.add('enterFullscreen');
    button.classList.remove('exitFullscreen');
  });

  button.addEventListener('mouseup', toggle.toggle.bind(toggle));
}

function getCenter() {
  var centerX = window.innerWidth / 2;
  var centerY = window.innerHeight / 2;

  return { x: centerX, y: centerY };
}

var rocks = [
  { x: 200, y: 100, color: '#F00', rotation: 0 }
];

domready(function() {
  var canvas   = document.querySelector('#gameScreen');
  var context  = canvas.getContext('2d');
  var keys     = arcadeKeys.keys;
  var ak       = arcadeKeys([keys.left, keys.right, keys.down, keys.up]);

  var rotation      = 0;
  var rotationSpeed = 3;

  var moveVector = { x: 0, y: 0 };
  var position   = { x: 200, y: 200 };

  setupToggle();

  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function getCenteredOn() {
    return position;
  }

  function getTranslated(position) {
    var center = getCenter();
    var centeredOn = getCenteredOn();

    var x = center.x + (position.x - centeredOn.x);
    var y = center.y + (position.y - centeredOn.y);

    return { x: x, y: y };
  }

  function drawShip() {
    var pos = getTranslated(position);

    context.save();
    context.fillStyle = '#00F';
    context.translate(pos.x, pos.y);
    context.beginPath();
    context.rotate(rotation * (Math.PI / 180));
    context.moveTo(0, -20);
    context.lineTo(20, 20);
    context.lineTo(0, 10);
    context.lineTo(-20, 20);
    context.closePath();
    context.fill();
    context.restore();
  }

  function drawRock(rock) {
    var pos = getTranslated(rock);

    var size = 10;

    context.save();
    context.fillStyle = rock.color;
    context.translate(pos.x, pos.y);
    context.beginPath();

    context.rotate(rock.rotation * (Math.PI / 180));

    context.moveTo(-size, -size);
    context.lineTo(-size, size);
    context.lineTo(size, size);
    context.lineTo(size, -size);

    context.closePath();
    context.fill();
    context.restore();
  }

  function drawRocks() {
    rocks.forEach(drawRock);
  }

  function draw() {
    drawShip();
    drawRocks();
  }

  function handleRotation() {
    if (ak.isPressed(keys.left)) {
      rotation -= rotationSpeed;
    }

    if (ak.isPressed(keys.right)) {
      rotation += rotationSpeed;
    }

    if (ak.isPressed(keys.up)) {
      position.y -= 3;
    }

    if (ak.isPressed(keys.down)) {
      position.y += 3;
    }

    rotation %= 360;
  }

  function updateRock(rock) {
    rock.rotation = (rock.rotation + 1) % 360;
  }

  function updateRocks() {
    rocks.forEach(updateRock);
  }

  function update() {
    handleRotation();
    updateRocks();
  }

  function setDimensions() {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
  }

  function onResize() {
    setDimensions();
  }

  function loop() {
    window.requestAnimationFrame(loop)

    clear();
    update();
    draw();
  }

  window.addEventListener('resize', onResize);

  setDimensions();
  loop();
});
