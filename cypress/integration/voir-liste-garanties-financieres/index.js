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

Given('je suis dreal de la region {string}', function (region) {
  cy.get('@userEmail').then((email) => {
    cy.addUserToDreal(email, region)
  })
})

When(
  'je me rends sur la page admin qui liste les garanties financières',
  () => {
    cy.visit('/admin/garanties-financieres.html')
  }
)

Then('le projet {string} se trouve dans la liste', (nomProjet) => {
  cy.findContaining(testid('gfList-item'), nomProjet)
})

Then('le projet {string} ne se trouve pas dans la liste', (nomProjet) => {
  cy.findContaining(testid('gfList-item'), nomProjet).should('not.exist')
})

Then(
  "chaque ligne contient la date des dépôt des garanties financières telle que saisie par l'utilisateur",
  () => {
    cy.get(testid('gfList-item-garanties-financieres')).should(
      'contain.text',
      'Déposées le 05/06/2020'
    )
  }
)

Then(
  'chaque ligne contient un lien pour télécharger le fichier en pièce-jointe',
  () => {
    cy.get(testid('gfList-item-download-link'))
      .should('contain.text', 'Télécharger la pièce-jointe')
      .should('have.attr', 'href')
      .and('match', /fichier\.pdf/)
  }
)

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
