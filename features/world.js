const { setWorldConstructor } = require('cucumber')

class CustomWorld {
  constructor() {
    this.who = 'personne'
    this.action = 'rien'
  }

  jeSuis(str) {
    this.who = str
  }

  jeVisite(page) {}

  faireQuelqueChose(quoi) {
    this.action = quoi
  }
}

setWorldConstructor(CustomWorld)
