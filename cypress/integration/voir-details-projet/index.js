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

When(
  'je ne peux pas me rendre sur la page du projet {string}',
  (projectName) => {
    cy.getProjectId(projectName).then((projectId) => {
      cy.request({
        url: `/projet/${projectId}/details.html`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404)
      })
    })
  }
)

Then('je vois les notes du projet', () => {
  cy.get(testid('project-note')).should('exist')
})

Then('je ne vois pas les notes du projet', () => {
  cy.get(testid('project-note')).should('not.exist')
})

Then("le menu action n'est pas visible", () => {
  cy.get(testid('project-actions')).should('not.exist')
})

Then('le menu action est visible', () => {
  cy.get(testid('project-actions')).should('exist')
})

When("j'ouvre la section {string}", async function (intituleSection) {
  cy.contains(intituleSection).click()
})

Then('le lien pour {string} est visible', (linkTitle) => {
  cy.contains(linkTitle).should('exist')
})

Then("le lien pour {string} n'est pas visible", (linkTitle) => {
  cy.contains(linkTitle).should('not.exist')
})
