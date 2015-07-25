var domready         = require('domready');
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
  var canvas  = document.querySelector('#gameScreen');
  var context = canvas.getContext('2d');

  setupToggle();

  function draw() {
    var center = getCenter();

    context.save();
    context.fillStyle = '#00F';
    context.translate(center.x, center.y);
    context.beginPath();
    context.moveTo(0, -20);
    context.lineTo(20, 20);
    context.lineTo(0, 10);
    context.lineTo(-20, 20);
    context.closePath();
    context.fill();
    context.restore();
  }

  function setDimensions() {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
  }

  function resizeAndDraw() {
    setDimensions();
    draw();
  }

  function onResize() {
    resizeAndDraw();
  }

  window.addEventListener('resize', onResize);

  resizeAndDraw();
});
