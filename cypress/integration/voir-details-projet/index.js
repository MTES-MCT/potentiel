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

When('je me rends sur la page du projet {string}', (projectName) => {
  cy.getProjectId(projectName).then((projectId) => {
    cy.log(projectId)
    cy.visit(`/projet/${projectId}/details.html`)
  })
})

Then("le menu action n'est pas visible", () => {
  cy.get(testid('project-actions')).should('not.exist')
})

Then('le menu action est visible', () => {
  cy.get(testid('project-actions')).should('exist')
})
