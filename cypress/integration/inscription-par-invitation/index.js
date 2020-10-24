/* global Cypress, cy */

/// <reference types="cypress" />
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import testid from '../../helpers/testid'

Given('je suis déconnecté', function () {
  cy.logout()
})

When("je clique sur le lien d'activation que j'ai reçu", () => {
  cy.get('@userEmail').then((userEmail) => {
    cy.request({
      method: 'POST',
      url: '/test/createInvitation',
      body: {
        email: userEmail,
      },
    }).then((res) => {
      Cypress.log({
        message: 'invitation link is ' + res.body,
      })
      cy.visit(res.body)
    })
  })
})

Then("je suis dirigé vers la page d'identification", () => {
  cy.url().should('include', 'login.html')
})

Then('mon champ email est déjà pré-rempli', () => {
  cy.get('@userEmail').then((userEmail) => {
    cy.get(testid('email-field')).should('have.value', userEmail)
  })
})
