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

Given("un autre porteur de projet inscrit avec l'adresse {string}", function (
  userEmail
) {
  cy.createUserWithEmail(userEmail)
})

When('je me rends sur la page du projet {string}', (projectName) => {
  cy.getProjectId(projectName).then((projectId) => {
    cy.log(projectId)
    cy.visit(`/projet/${projectId}/details.html`)
  })
})

When("j'ouvre la section {string}", async function (intituleSection) {
  cy.contains(intituleSection).click()
})

When('je click sur le bouton {string}', async function (intituleBouton) {
  cy.contains(intituleBouton).click()
})

When('je saisis la valeur {string} dans le champ {string}', async function (
  value,
  fieldName
) {
  cy.get(testid(fieldName + '-field')).type(value)
})

When('je valide le formulaire', () => {
  cy.get(testid('submit-button')).click()
})

Then('on me notifie la réussite par {string}', (successMessage) => {
  cy.get(testid('success-message')).should('contain', successMessage)
})

Then(
  '{string} reçoit un mail de notification avec un lien vers le projet {string}',
  (email, projectName) => {
    cy.getSentEmails().then((sentEmails) => {
      cy.wrap(sentEmails).should('have.length', 1)
      cy.wrap(sentEmails[0]).should('have.property', 'destinationEmail')
      cy.wrap(sentEmails[0].destinationEmail).should('equal', email)
      cy.wrap(sentEmails[0]).should('have.property', 'invitationLink')
      cy.getProjectId(projectName).then((projectId) => {
        cy.wrap(sentEmails[0].invitationLink).should('contain', projectId)
      })
    })
  }
)

Then('{string} a accès au projet {string}', (email, projectName) => {
  cy.checkUserAccessToProject(email, projectName).then((access) => {
    cy.wrap(access).should('equal', true)
  })
})

Then(
  "{string} reçoit un mail de notification avec un lien d'invitation",
  (email) => {
    cy.getSentEmails().then((sentEmails) => {
      cy.wrap(sentEmails).should('have.length', 1)
      cy.wrap(sentEmails[0]).should('have.property', 'destinationEmail')
      cy.wrap(sentEmails[0].destinationEmail).should('equal', email)
      cy.wrap(sentEmails[0]).should('have.property', 'invitationLink')
      cy.wrap(sentEmails[0].invitationLink).should(
        'contain',
        '/enregistrement.html'
      )
      cy.wrap(sentEmails[0].invitationLink).should(
        'contain',
        'projectAdmissionKey'
      )
      cy.wrap(sentEmails[0].invitationLink).as('invitationLink')
    })
  }
)

When('je me déconnecte', () => {
  cy.logout()
})

When(
  "je click sur le lien d'invitation reçu dans le mail de notification",
  () => {
    cy.get('@invitationLink').then((invitationLink) => {
      cy.visit(invitationLink)
    })
  }
)

Then('je suis dirigé vers la page de création de compte', () => {
  cy.url().should('include', 'enregistrement.html')
})

When('je remplis mon mot de passe', () => {
  cy.get(testid('password-field')).type('test')
  cy.get(testid('confirm-password-field')).type('test')
})
Then('je suis dirigé vers la page qui liste mes projets', () => {
  cy.url().should('include', 'mes-projets.html')
})

Then('le projet {string} se trouve dans ma liste de projets', (nomProjet) => {
  cy.findContaining(testid('projectList-item'), nomProjet)
})
