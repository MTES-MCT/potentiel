/// <reference types="cypress" />
import {
  Before,
  Given,
  When,
  And,
  Then,
} from 'cypress-cucumber-preprocessor/steps'
import testid from '../../helpers/testid'

Given('les projets suivants', async function (dataTable) {
  cy.insertProjectsForUser(dataTable.hashes())
})

Given('mon compte est lié aux projets suivants', async function (dataTable) {
  cy.insertProjectsForUser(dataTable.hashes())
})

Given('je suis dreal de la region {string}', function (region) {
  cy.get('@userEmail').then((email) => {
    cy.addUserToDreal(email, region)
  })
})

When('je me rends sur la page qui liste mes projets', () => {
  cy.visit('/mes-projets.html')
})

When('je me rends sur la page admin qui liste les projets', () => {
  cy.visit('/admin/dashboard.html')
})

Then('le projet {string} se trouve dans la liste', (nomProjet) => {
  cy.findContaining(testid('projectList-item'), nomProjet)
})

Then('le projet {string} ne se trouve pas dans la liste', (nomProjet) => {
  cy.findContaining(testid('projectList-item'), nomProjet).should('not.exist')
})

Then("la colonne {string} n'est pas visible", (colonneName) => {
  cy.findContaining('th', colonneName).should('not.exist')
})

Then('la colonne {string} est visible', (colonneName) => {
  cy.findContaining('th', colonneName)
})
