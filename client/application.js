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

domready(function() {
  var canvas   = document.querySelector('#gameScreen');
  var context  = canvas.getContext('2d');
  var keys     = arcadeKeys.keys;
  var ak       = arcadeKeys([keys.left, keys.right]);

  var rotation      = 0;
  var rotationSpeed = 3;

  setupToggle();

  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function draw() {
    var center = getCenter();

    context.save();
    context.fillStyle = '#00F';
    context.translate(center.x, center.y);
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

  function update() {
    if (ak.isPressed(keys.left)) {
      rotation -= rotationSpeed;
    }

    if (ak.isPressed(keys.right)) {
      rotation += rotationSpeed;
    }

    rotation %= 360;
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
