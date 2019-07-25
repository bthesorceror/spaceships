const domready = require('domready')
const arcadeKeys = require('arcade_keys')
const FullscreenToggle = require('./fullscreen_toggle')
const Screen = require('./screen')
const Ship = require('./ship')
const MiniMap = require('./mini_map')
const collision = require('./collision')
const Gameloop = require('migl-gameloop')
const Map = require('./map')
const intersects = require('./intersects')

const Scoreboard = require('./ui/scoreboard')

const MAXWIDTH = 10000
const MAXHEIGHT = 10000

function setupToggle () {
  const button = document.querySelector('#fullscreenToggle')
  const toggle = new FullscreenToggle()

  toggle.on('on', function () {
    button.classList.add('exitFullscreen')
    button.classList.remove('enterFullscreen')
  })

  toggle.on('off', function () {
    button.classList.add('enterFullscreen')
    button.classList.remove('exitFullscreen')
  })

  button.addEventListener('mouseup', () => {
    toggle.toggle()
  })
}

let rocks = require('./data/rocks')(250, MAXWIDTH, MAXHEIGHT)

domready(function () {
  const map = new Map(MAXWIDTH, MAXHEIGHT)

  const scoreboard = new Scoreboard()
  document.querySelector('body').appendChild(scoreboard.view)

  const loop = new Gameloop()
  const canvas = document.querySelector('#gameScreen')
  const ak = arcadeKeys()

  const screen = new Screen(canvas, map)

  const miniMap = new MiniMap(map, screen)
  document.querySelector('body').appendChild(miniMap.canvas)

  const ship = new Ship(ak)
  ship.setPosition(200, 200)
  screen.focusOn(ship)

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
          scoreboard.increment(5)
          return
        }
      }

      if (!intersects(rock, map)) {
        removals.push(rock)
        // TODO: Replace Rock
        return
      }

      if (collision(ship, rock)) {
        ship.markAsDestroyed()
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
