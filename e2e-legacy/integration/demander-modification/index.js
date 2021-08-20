/* global cy */

/// <reference types="cypress" />
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import testid from '../../helpers/testid'

Given('mon compte est lié aux projets suivants', async function (dataTable) {
  cy.insertProjectsForUser(dataTable.hashes())
})

When('je me rends sur la page qui liste mes projets', () => {
  cy.visit('/mes-projets.html')
})

When(
  'je click sur le bouton {string} au niveau de mon projet {string}',
  async function (intituleBouton, nomProjet) {
    cy.findContaining(testid('projectList-item'), nomProjet)
      .get(testid('item-action'))
      .contains(intituleBouton)
      .click({ force: true })
  }
)

Then('je suis dirigé vers la page de demande de modification de {string}', (typeModification) => {
  cy.url().should('include', 'demande-modification.html')
  cy.url().should('include', 'action=' + typeModification)
})

When('je saisis la valeur {string} dans le champ {string}', async function (value, fieldName) {
  cy.get(testid('modificationRequest-' + fieldName + 'Field')).type(value)
})

When('je choisis un fichier dans le champ pièce-jointe', function () {
  cy.fixture('example.json').then((fileContent) => {
    cy.get(testid('modificationRequest-fileField')).attachFile({
      fileContent,
      fileName: 'example.json',
      mimeType: 'application/json',
    })
  })
})

When('je valide le formulaire', () => {
  cy.get(testid('submit-button')).click()
})

Then('on me notifie la réussite par {string}', (successMessage) => {
  cy.get(testid('success-message')).should('contain', successMessage)
})

When('je me rends sur la page qui liste mes demandes', () => {
  cy.visit('/mes-demandes.html')
})

Then(
  'je vois ma demande de modification {string} pour mon projet {string}',
  (modificationType, projectName) => {
    cy.get(testid('requestList-item-nomProjet')).should('contain', projectName)
    cy.get(testid('requestList-item-type')).should('contain', modificationType)
  }
)

Then('je vois un lien pour {string} pour mon projet {string}', (linkTitle, projectName) => {
  cy.get(testid('requestList-item-nomProjet')).should('contain', projectName)
  cy.get(testid('requestList-item-download-link')).should('contain', linkTitle)
})
