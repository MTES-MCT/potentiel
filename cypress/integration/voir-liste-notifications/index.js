/// <reference types="cypress" />
import {
  Before,
  Given,
  When,
  And,
  Then,
} from 'cypress-cucumber-preprocessor/steps'
import testid from '../../helpers/testid'

Given('les notifications suivantes', async function (dataTable) {
  cy.insertNotifications(dataTable.hashes())
})

When('je me rends sur la page admin qui liste les notifications', () => {
  cy.visit('/admin/notifications.html')
})

Then('la notification de {string} se trouve dans la liste', (email) => {
  cy.findContaining(testid('notificationList-item'), email)
})

Then('la notification de {string} ne se trouve pas dans la liste', (email) => {
  cy.findContaining(testid('notificationList-item'), email).should('not.exist')
})

When('je click sur le bouton {string}', (buttonName) => {
  cy.contains(buttonName).click()
})

Then('{string} emails de notifications sont envoyés', (numberString) => {
  cy.getSentEmails().then((sentEmails) => {
    cy.log(sentEmails)
    cy.wrap(sentEmails.length).should('equal', Number(numberString))
  })
})

Then('{string} reçoit un mail de notification', (email) => {
  cy.wrap(email).as('notificationEmail')
  cy.getSentEmails().then((sentEmails) => {
    cy.wrap(sentEmails).should('have.length.of.at.least', 1)
    const notificationEmail = sentEmails.find((sentEmail) =>
      sentEmail.recipients.some((recipient) => recipient.email === email)
    )
    cy.wrap(notificationEmail).should('exist')
  })
})
