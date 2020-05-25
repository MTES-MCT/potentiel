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

When('je me rends sur la page du projet {string}', (projectName) => {
  cy.wrap(projectName).as('projectName')
  cy.getProjectId(projectName).then((projectId) => {
    cy.log(projectId)
    cy.visit(`/projet/${projectId}/details.html`)
  })
})

When('je click sur le bouton {string}', async function (intituleBouton) {
  cy.findContaining(testid('frise-action'), intituleBouton).click()
})

When('je saisis la valeur {string} dans le champ {string}', async function (
  value,
  fieldName
) {
  cy.get(testid(fieldName + '-field')).type(value)
})

When('je choisis un fichier dans le champ pièce-jointe', function () {
  cy.fixture('example.json').then((fileContent) => {
    cy.get(testid('file-field')).upload({
      fileContent,
      fileName: 'example.json',
      mimeType: 'application/json',
    })
  })
})

When('je valide le formulaire', () => {
  cy.get(testid('submit-gf-button')).click()
})

Then('on me notifie la réussite par {string}', (successMessage) => {
  cy.get(testid('success-message')).should('contain', successMessage)
})

Then("je vois que l'étape {string} de la frise est validée", (etape) => {
  cy.findContaining(testid('frise-title'), etape).should(
    'have.attr',
    'data-status',
    'past'
  )
})

Then("l'étape a été enregistrée dans l'historique du projet", () => {
  cy.get('@projectName').then((projectName) => {
    cy.getProject(projectName).then((project) => {
      expect(project).to.not.be.undefined
      expect(project).to.have.property('history')
      expect(project.history).to.have.lengthOf(1)
      expect(project.history[0].before).to.have.keys(
        'garantiesFinancieresDate',
        'garantiesFinancieresFile',
        'garantiesFinancieresSubmittedBy',
        'garantiesFinancieresSubmittedOn'
      )
      expect(project.history[0].after).to.have.keys(
        'garantiesFinancieresDate',
        'garantiesFinancieresFile',
        'garantiesFinancieresSubmittedBy',
        'garantiesFinancieresSubmittedOn'
      )
      expect(project.history[0].type).to.equal(
        'garanties-financieres-submission'
      )
    })
  })
})
