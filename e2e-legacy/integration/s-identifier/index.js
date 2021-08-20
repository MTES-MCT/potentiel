/* global cy */

import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import testid from '../../helpers/testid'

Given("je suis sur la page d'identification", () => {
  cy.visit('/login.html')
})

When('je saisis {string} dans le champ email', (email) => {
  cy.get(testid('email-field')).type(email)
})

When('je saisis {string} dans le champ mot de passe', (password) => {
  cy.get(testid('password-field')).type(password)
})

When('je valide le formulaire', (term) => {
  cy.get(testid('submit-button')).click()
})

Then("le site me redirige vers la page d'accueil de mon compte porteur de projet", () => {
  cy.url().should('include', '/mes-projets.html')
})
