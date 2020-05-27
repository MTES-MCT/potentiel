/// <reference types="cypress" />
import {
  Before,
  Given,
  When,
  And,
  Then,
} from 'cypress-cucumber-preprocessor/steps'
import testid from '../../helpers/testid'

Given('le projet suivant', async function (dataTable) {
  cy.insertProjectsForUser(dataTable.hashes())
})

When('je me rends sur la page de gestion des DREAL', () => {
  cy.visit(`/admin/dreals.html`)
})

When('je saisis la valeur {string} dans le champ {string}', async function (
  value,
  fieldName
) {
  cy.get(testid(fieldName + '-field'))
    .clear()
    .type(value)
})

When('je sélectionne {string} dans le menu déroulant {string}', async function (
  optionTitle,
  fieldName
) {
  cy.get(testid(fieldName + '-field')).select(optionTitle)
})

When('je valide le formulaire', () => {
  cy.get(testid('submit-button')).click()
})

Then('on me notifie la réussite par {string}', (successMessage) => {
  cy.get(testid('success-message')).should('contain', successMessage)
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

Then('{string} apparait dans la liste des dreal invitées', (email) => {
  cy.findContaining(testid('invitationList-item'), email)
})

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
Then('je suis dirigé vers la page qui liste les garanties financières', () => {
  cy.url().should('include', '/admin/garanties-financieres.html')
})

Then('le projet {string} se trouve dans la liste', (nomProjet) => {
  cy.findContaining(testid('gfList-item'), nomProjet)
})

Then('le projet {string} ne se trouve pas dans la liste', (nomProjet) => {
  cy.findContaining(testid('gfList-item'), nomProjet).should('not.exist')
})

When("je me connecte en tant qu'admin", () => {
  cy.login('admin@test.test', 'test')
})

Then('{string} apparait dans la liste des dreal inscrites', (email) => {
  cy.findContaining(testid('drealList-item'), email)
})
