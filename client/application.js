var domready = require('domready')
var arcadeKeys = require('arcade_keys')
var FullscreenToggle = require('./fullscreen_toggle')
var Screen = require('./screen')
var Ship = require('./ship')
var Rock = require('./rock')
var MiniMap = require('./mini_map')
var collision = require('./collision')
var Gameloop = require('migl-gameloop')
var Map = require('./map')
var intersects = require('./intersects')

var MAXWIDTH = 10000
var MAXHEIGHT = 10000

function setupToggle () {
  var button = document.querySelector('#fullscreenToggle')
  var toggle = new FullscreenToggle()

  toggle.on('on', function () {
    button.classList.add('exitFullscreen')
    button.classList.remove('enterFullscreen')
  })

  toggle.on('off', function () {
    button.classList.add('enterFullscreen')
    button.classList.remove('exitFullscreen')
  })

  button.addEventListener('mouseup', toggle.toggle.bind(toggle))
}

var rocks = require('./data/rocks')(250, MAXWIDTH, MAXHEIGHT)

domready(function () {
  var loop = new Gameloop()
  var canvas = document.querySelector('#gameScreen')
  var keys = arcadeKeys.keys
  var ak = arcadeKeys()

  var map = new Map(MAXWIDTH, MAXHEIGHT)

  var screen = new Screen(canvas, map)
  screen.setCenteredOn(200, 200)

  var ship = new Ship(ak)
  ship.setPosition(200, 200)

  var miniMap = new MiniMap(document.querySelector('#miniMap'), map)

  miniMap.setCanvasSize(screen)

  setupToggle()

  function draw () {
    miniMap.drawScreenOutline(screen)
    miniMap.drawObject(ship, '#0F0')
    rocks.forEach(function (r) {
      r.draw(screen)
      miniMap.drawObject(r, '#F3F')
    })
    ship.draw(screen)
  }

  function update () {
    ship.update()
    rocks.forEach(function (r) { r.update() })
    screen.focusOn(ship)
  }

  function setDimensions () {
    screen.setDimensions(window.innerWidth, window.innerHeight)
    miniMap.setCanvasSize(screen)
  }

  function shipOutOfBounds () {
    var bbox = ship.boundingBox()
    return bbox.topLeft.x < 0 || bbox.bottomRight.x > map.width() ||
      bbox.topLeft.y < 0 || bbox.bottomRight.y > map.height()
  }

  function checkCollisions () {
    var removals = []
    var additions = []

    if (ship.isActive() && shipOutOfBounds()) {
      ship.markAsDestroyed()
    }

    rocks.forEach(function (rock) {
      for (var i = 0; i < ship.bullets.length; i++) {
        var bullet = ship.bullets[i]

        if (collision(bullet, rock)) {
          removals.push(rock)
          additions = additions.concat.apply(additions, rock.fromBulletImpact())
          ship.markBulletForRemoval(bullet)
          return
        }
      }

      if (!intersects(rock, map)) {
        removals.push(rock)
        return
      }

      if (collision(ship, rock)) {
        ship.markAsDestroyed()
        return
      }
    })

    ship.purgeBullets()

    rocks = rocks.filter(function (rock) {
      return removals.indexOf(rock) < 0
    })

    rocks = rocks.concat.apply(rocks, additions)
  }

  var step = 1.0 / 60.0
  var currentDelta = 0
  loop.update = function (delta) {
    currentDelta += (delta / 1000.0)
    while (currentDelta > step) {
      currentDelta -= step
      update()
      checkCollisions()
    }
  }

  loop.render = function (delta) {
    screen.clear()
    miniMap.clear()
    draw()
  }

  loop.start()

  function onResize () {
    setDimensions()
  }

  window.addEventListener('resize', onResize)

  setDimensions()
})
