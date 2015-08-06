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

  var MAXWIDTH  = 10000;
  var MAXHEIGHT = 10000;

  function focusOnShip() {
    var x = ship.position.x;
    var y = ship.position.y;

    var halfWidth  = screen.getWidth() / 2;
    var halfHeight = screen.getHeight() / 2;

    if (x < halfWidth) {
      x = halfWidth;
    } else if (x > MAXWIDTH - halfWidth) {
      x = MAXWIDTH - halfWidth;
    }

    if (y < halfHeight) {
      y = halfHeight;
    } else if (y > MAXHEIGHT - halfHeight) {
      y = MAXHEIGHT - halfHeight;
    }

    screen.setCenteredOn(x, y);
  }

  var miniMapCanvas = document.querySelector('#miniMap');
  var miniMapContext = miniMapCanvas.getContext('2d');

  function setMiniMapSize() {
    var percent = .25;
    miniMapCanvas.width = screen.getWidth() * percent;
    miniMapCanvas.height = screen.getWidth() * percent;
  }
  setMiniMapSize();

  function clearMiniMap() {
    miniMapContext.clearRect(0, 0,
      miniMapCanvas.width, miniMapCanvas.height);

    miniMapContext.save();
    miniMapContext.fillStyle="rgba(0,0,0,0.9)";
    miniMapContext.fillRect(0, 0,
      miniMapCanvas.width, miniMapCanvas.height);
    miniMapContext.restore();
  }

  function drawScreenOnMiniMap(screen) {
    var adjustmentX = (miniMapCanvas.width / MAXWIDTH);
    var adjustmentY = (miniMapCanvas.height / MAXHEIGHT);

    var x = adjustmentX * screen.centeredOn.x;
    var y = adjustmentY * screen.centeredOn.y;

    var width = adjustmentX * screen.getWidth() / 2;
    var height = adjustmentX * screen.getHeight() / 2;

    miniMapContext.save();
    miniMapContext.strokeStyle = '#00F';
    miniMapContext.translate(x, y);

    miniMapContext.beginPath();
    miniMapContext.moveTo(-width,-height);
    miniMapContext.lineTo(width, -height);
    miniMapContext.lineTo(width, height);
    miniMapContext.lineTo(-width, height);
    miniMapContext.closePath();

    miniMapContext.stroke();
    miniMapContext.restore();
  }

  function drawOnMiniMap(obj, color) {
    var x = (miniMapCanvas.width / MAXWIDTH) * obj.position.x;
    var y = (miniMapCanvas.height / MAXHEIGHT) * obj.position.y;

    miniMapContext.save();
    miniMapContext.fillStyle = color;
    miniMapContext.translate(x, y);

    miniMapContext.beginPath();
    miniMapContext.moveTo(-1,-1);
    miniMapContext.lineTo(1, -1);
    miniMapContext.lineTo(1, 1);
    miniMapContext.lineTo(-1, 1);
    miniMapContext.closePath();

    miniMapContext.fill();
    miniMapContext.restore();
  }

  ship.on('positionChanged', function(position) {
    focusOnShip();
  });

  setupToggle();

  function draw() {
    drawScreenOnMiniMap(screen);
    drawOnMiniMap(ship, '#0F0');
    ship.draw(screen);
    rocks.forEach(function(r) {
      r.draw(screen);
      drawOnMiniMap(r, r.color);
    });
  }

  function update() {
    ship.update();
    rocks.forEach(function(r) { r.update() });
  }

  function setDimensions() {
    screen.setDimensions(window.innerWidth, window.innerHeight);
    setMiniMapSize();
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
    clearMiniMap();
    update();
    checkCollisions();
    draw();
  }

  function onResize() {
    setDimensions();
    focusOnShip();
  }

  window.addEventListener('resize', onResize);

  setDimensions();
  loop();
});
