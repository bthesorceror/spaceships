class Scoreboard {
  constructor (score = 0) {
    this.score = score
    this.view = document.createElement('div')
    this.view.id = 'scoreboard'
    this.update()
  }

  increment (inc) {
    this.score += inc
    this.update()
  }

  update () {
    this.view.innerText = `Score ${this.score}`
  }
}

module.exports = Scoreboard
