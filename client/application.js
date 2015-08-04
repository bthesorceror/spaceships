var domready         = require('domready');
var arcadeKeys       = require('arcade_keys');
var FullscreenToggle = require('./fullscreen_toggle');
var Screen           = require('./screen');
var Ship             = require('./ship');

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

var rocks = [
  { x: 200, y: 100, color: '#F00', rotation: 0, speed: 10 },
  { x: 100, y: 400, color: '#FF0', rotation: 40, speed: 3 },
  { x: 400, y: 400, color: '#F0F', rotation: 0, speed: 1}
];

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
    var size = 10;
    screen.draw(function(context) {
      var pos = this.getTranslatedPosition(rock);

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
    });
  }

  function drawRocks() {
    rocks.forEach(drawRock);
  }

  function draw() {
    ship.draw(screen);
    drawRocks();
  }

  function updateRock(rock) {
    rock.rotation = (rock.rotation + rock.speed) % 360;
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
