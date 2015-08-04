var domready         = require('domready');
var arcadeKeys       = require('arcade_keys');
var FullscreenToggle = require('./fullscreen_toggle');
var Screen           = require('./screen');
var Ship             = require('./ship');
var Rock             = require('./rock');

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

var rocks = require('./data/rocks').map(function(data) {
  var rock = new Rock();
  rock.setAttributesFromData(data);
  return rock;
});

domready(function() {
  var canvas   = document.querySelector('#gameScreen');
  var keys     = arcadeKeys.keys;
  var ak       = arcadeKeys([keys.left, keys.right, keys.down, keys.up]);

  var screen = new Screen(canvas);
  screen.setCenteredOn(200, 200);

  var ship = new Ship(ak);
  ship.setPosition(200, 200);

  ship.on('positionChanged', function(position) {
    screen.setCenteredOn(position.x, position.y);
  });

  setupToggle();

  function drawRock(rock) {
    rock.draw(screen);
  }

  function drawRocks() {
    rocks.forEach(drawRock);
  }

  function draw() {
    ship.draw(screen);
    drawRocks();
  }

  function updateRock(rock) {
    rock.update();
  }

  function updateRocks() {
    rocks.forEach(updateRock);
  }

  function update() {
    ship.update();
    updateRocks();
  }

  function setDimensions() {
    screen.setDimensions(window.innerWidth, window.innerHeight);
  }

  function loop() {
    window.requestAnimationFrame(loop)
    screen.clear();
    update();
    draw();
  }

  window.addEventListener('resize', setDimensions);

  setDimensions();
  loop();
});
