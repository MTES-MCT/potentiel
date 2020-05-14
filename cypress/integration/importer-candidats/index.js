/// <reference types="cypress" />
import {
  Before,
  Given,
  When,
  And,
  Then,
} from 'cypress-cucumber-preprocessor/steps'
import testid from '../../helpers/testid'

Given("je me rends sur la page d'import de candidats", () => {
  cy.visit('/admin/importer-candidats.html')
})

When('je selectionne le fichier {string}', async function (filename) {
  // Don't ask me why base64 works...
  cy.fixture(filename, 'base64').then((fileContent) => {
    cy.get(testid('candidats-field')).upload({
      fileContent,
      fileName: 'candidats.csv',
      mimeType: 'text/plain',
      encoding: 'base64',
    })
  })
})

When('je valide le formulaire', () => {
  cy.get(testid('submit-button')).click()
})

Then('je suis dirigé vers la page qui liste les projets à notifier', () => {
  cy.url().should('include', '/admin/notifier-candidats.html')
})

Then('je suis dirigé vers la page qui liste les projets', () => {
  cy.url().should('include', '/admin/dashboard.html')
})

Then('on me notifie la réussite par {string}', (successMessage) => {
  cy.get(testid('success-message')).should('contain', successMessage)
})

Then(
  'je trouve bien le projet {string} dans la liste des projets',
  (projectName) => {
    cy.get(testid('projectList-item-nomProjet')).should('contain', projectName)
  }
)

Given('le projet suivant', async function (dataTable) {
  cy.insertProjectsForUser(dataTable.hashes())
})

Then("la liste ne contient qu'un seul projet", () => {
  cy.get(testid('projectList-item')).should('have.length', 1)
})
