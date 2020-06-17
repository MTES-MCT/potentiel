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

Then('je suis redirigé vers la page qui liste les projets', () => {
  cy.url().should('include', '/admin/dashboard.html')
})

When('je click sur la ligne {string}', (projectName) => {
  cy.contains(projectName).click()
})

Then('je suis redirigé vers la page du projet {string}', (projectName) => {
  cy.getProjectId(projectName).then((projectId) => {
    cy.url().should('include', `/projet/${projectId}/details.html`)
  })
})

When('je saisis la valeur {string} dans le champ {string}', async function (
  value,
  fieldName
) {
  cy.get(testid(fieldName + '-field'))
    .clear()
    .type(value)
})

When('je valide le formulaire', (term) => {
  cy.get(testid('submit-button')).click()
})
