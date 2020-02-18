const { Given, When, Then } = require('cucumber')
const { expect } = require('chai')

Given('je suis un utilisateur', function() {
  // A implémenter
  this.jeSuis('utilisateur')
})

Given('je visite la bonne page', function() {
  this.jeVisite('bonne page')
})

When('je lance une action', function() {
  this.faireQuelqueChose('action')
})

Then("l'appli doit faire quelque chose", function() {
  expect(this.who).to.eql('utilisateur', 'Mauvais utilisateur !')
  expect(this.action).to.eql('action', 'Mauvaise action !')
})
