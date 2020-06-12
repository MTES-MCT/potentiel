/// <reference types="cypress" />
import {
  Before,
  Given,
  When,
  And,
  Then,
} from 'cypress-cucumber-preprocessor/steps'
import testid from '../../helpers/testid'

Given('les invitations suivantes', async function (dataTable) {
  cy.insertInvitations(dataTable.hashes())
})

When('je me rends sur la page admin qui liste les invitations', () => {
  cy.visit('/admin/invitations.html')
})

Then("l'invitation de {string} se trouve dans la liste", (email) => {
  cy.findContaining(testid('invitationList-item'), email)
})

Then("l'invitation de {string} ne se trouve pas dans la liste", (email) => {
  cy.findContaining(testid('invitationList-item'), email).should('not.exist')
})

When("je sélectionne l'appel d'offre {string}", (appelOffre) => {
  cy.get(testid('appelOffreIdSelector')).select(appelOffre)
})

When('je sélectionne la période {string}', (periode) => {
  cy.get(testid('periodeIdSelector')).select(periode)
})

When('je click sur le bouton {string}', (buttonName) => {
  cy.contains(buttonName).click()
})

When(
  "je click sur le bouton {string} pour l'invitation à {string}",
  (buttonName, email) => {
    cy.findContaining(testid('invitationList-item'), email)
      .contains(buttonName)
      .click()
  }
)

Then('{string} emails de notifications sont envoyés', (numberString) => {
  cy.getSentEmails().then((sentEmails) => {
    cy.log(sentEmails)
    cy.wrap(sentEmails.length).should('equal', Number(numberString))
  })
})

Then(
  "{string} reçoit un mail de notification avec un lien d'invitation",
  (email) => {
    cy.wrap(email).as('invitationEmail')
    cy.getSentEmails().then((sentEmails) => {
      cy.wrap(sentEmails).should('have.length.of.at.least', 1)
      const invitationEmail = sentEmails.find((sentEmail) =>
        sentEmail.recipients.some((recipient) => recipient.email === email)
      )
      cy.wrap(invitationEmail).should('exist')
      cy.wrap(invitationEmail.variables.invitation_link).should(
        'contain',
        '/enregistrement.html'
      )
      cy.wrap(invitationEmail.variables.invitation_link).should(
        'contain',
        'projectAdmissionKey'
      )
      cy.wrap(invitationEmail.variables.invitation_link).as('invitationLink')
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

Then('mon champ email est déjà pré-rempli', () => {
  cy.get('@invitationEmail').then((invitationEmail) => {
    cy.get(testid('email-field')).should('have.value', invitationEmail)
  })
})

Then('mon champ nom est déjà pré-rempli avec {string}', (name) => {
  cy.get(testid('fullName-field')).should('have.value', name)
})
