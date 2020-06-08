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
