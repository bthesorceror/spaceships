var domready = require('domready');

var inherits     = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

inherits(FullScreenToggle, EventEmitter);

function FullScreenToggle() {
  EventEmitter.call(this);
}

FullScreenToggle.prototype.isFullScreen = function() {
  return document.webkitFullscreenElement;
}

FullScreenToggle.prototype.toggle = function() {
  if (this.isFullScreen()) {
    document.webkitExitFullscreen();
    this.emit('off');
  } else {
    document.documentElement.webkitRequestFullscreen();
    this.emit('on');
  }
}

function setupToggle() {
  var button = document.querySelector('#fullscreenToggle');
  var toggle = new FullScreenToggle();

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

domready(function() {
  var canvas  = document.querySelector('#gameScreen');
  var context = canvas.getContext('2d');

  setupToggle();

  function draw() {
    var centerX = window.innerWidth / 2;
    var centerY = window.innerHeight / 2;

    context.save();
    context.fillStyle = '#00F';
    context.translate(centerX, centerY);
    context.beginPath();
    context.moveTo(0, -20);
    context.lineTo(20, 20);
    context.lineTo(-20, 20);
    context.closePath();
    context.fill();
    context.restore();
  }

  function setDimensions() {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
  }

  function onResize() {
    setDimensions();
    draw();
  }

  window.addEventListener('resize', onResize);

  setDimensions();
  draw();
});
