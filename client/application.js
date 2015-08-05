var domready         = require('domready');
var arcadeKeys       = require('arcade_keys');
var FullscreenToggle = require('./fullscreen_toggle');
var Screen           = require('./screen');
var Ship             = require('./ship');
var Rock             = require('./rock');
var collision        = require('./collision');

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

  function draw() {
    ship.draw(screen);
    rocks.forEach(function(r) { r.draw(screen) });
  }

  function update() {
    ship.update();
    rocks.forEach(function(r) { r.update() });
  }

  function setDimensions() {
    screen.setDimensions(window.innerWidth, window.innerHeight);
  }

  function checkCollisions() {
    rocks.forEach(function(rock) {
      if (collision(ship, rock)) {
        console.dir('Collision detected');
      }
    });
  }

  function loop() {
    window.requestAnimationFrame(loop)
    screen.clear();
    update();
    checkCollisions();
    draw();
  }

  window.addEventListener('resize', setDimensions);

  setDimensions();
  loop();
});
