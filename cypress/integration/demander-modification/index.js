/// <reference types="cypress" />
import {
  Before,
  Given,
  When,
  And,
  Then,
} from 'cypress-cucumber-preprocessor/steps'
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
      .get(testid('projectList-item-action'))
      .contains(intituleBouton)
      .click({ force: true })
  }
)

Then(
  'je suis dirigé vers la page de demande de modification de {string}',
  (typeModification) => {
    cy.url().should('include', 'demande-modification.html')
    cy.url().should('include', 'action=' + typeModification)
  }
)

When('je saisis la valeur {string} dans le champ {string}', async function (
  value,
  fieldName
) {
  cy.get(testid('modificationRequest-' + fieldName + 'Field')).type(value)
})

When('je valide le formulaire', () => {
  cy.get(testid('submit-button')).click()
})

Then('je suis redirigé vers la page qui liste mes demandes', () => {
  cy.location('pathname', { timeout: 10000 }).should(
    'include',
    '/mes-demandes.html'
  )
})

Then('me notifie la réussite par {string}', (successMessage) => {
  cy.get(testid('success-message')).should('contain', successMessage)
})

Then(
  'je vois ma demande de modification {string} pour mon projet {string}',
  (modificationType, projectName) => {
    cy.get(testid('requestList-item-nomProjet')).should('contain', projectName)
    cy.get(testid('requestList-item-type')).should('contain', modificationType)
  }
)
