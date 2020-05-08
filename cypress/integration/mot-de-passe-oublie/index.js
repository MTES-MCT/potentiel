/// <reference types="cypress" />
import {
  Before,
  Given,
  When,
  And,
  Then,
} from 'cypress-cucumber-preprocessor/steps'
import testid from '../../helpers/testid'

Given('je suis déconnecté', function () {
  cy.logout()
})

When("je vais sur la page d'oubli de mot de passe", () => {
  cy.visit('/mot-de-passe-oublie.html')
})

When('je saisis mon email dans le champ email', () => {
  cy.get('@userEmail').then((userEmail) => {
    cy.get(testid('email-field')).type(userEmail)
  })
})

When('je valide le formulaire', () => {
  cy.get(testid('submit-button')).click()
})

Then('on me notifie la réussite par {string}', (successMessage) => {
  cy.get(testid('success-message')).should('contain', successMessage)
})

When(
  'je clique sur le lien de récupération de mot de passe que je reçois par mail',
  () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.getSentEmails().then((emails) => {
        cy.wrap(emails).should('have.length', 1)
        const myEmail = emails.find(
          (email) => email.destinationEmail === userEmail
        )
        cy.wrap(myEmail).should('not.be.undefined')
        cy.visit(myEmail.resetLink)
      })
    })
  }
)

Then('je suis dirigé vers une page de changement de mot de passe', () => {
  cy.url().should('include', 'recuperation-mot-de-passe.html')
})

When(
  'je saisis le nouveau mot de passe {string} dans les deux champs',
  (newPassword) => {
    cy.wrap(newPassword).as('newPassword')
    cy.get(testid('password-field')).type(newPassword)
    cy.get(testid('confirm-password-field')).type(newPassword)
  }
)

When('je valide le formulaire', (term) => {
  cy.get(testid('submit-button')).click()
})

Then("je suis dirigé vers la page d'identification", () => {
  cy.url().should('include', 'login.html')
})

When('je saisis {string} dans le champ mot de passe', (password) => {
  cy.get('@newPassword').then((newPassword) => {
    cy.get(testid('password-field')).type(newPassword)
  })
})

Then('je suis dirigé vers la page qui liste mes projets', () => {
  cy.url().should('include', 'mes-projets.html')
})
