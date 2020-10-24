/* global cy */

/// <reference types="cypress" />
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Given('les projets suivants', async function (dataTable) {
  dataTable.hashes().forEach((project) => {
    cy.createUserWithEmail(project.email).then((res) => {
      cy.log(res)
      cy.insertProjectsForUser([project], res.body)
    })
  })
})

When("j'appelle le service de relance des garanties financieres", () => {
  cy.request({
    method: 'post',
    url: `/cron/relanceGarantiesFinancieres`,
  })
})

Then('{string} emails de relance sont envoyés', (numberString) => {
  cy.getSentEmails().then((sentEmails) => {
    cy.wrap(sentEmails.length).should('equal', Number(numberString))
  })
})

Then('{string} reçoit un mail de relance', (email, projectName) => {
  cy.getSentEmails().then((sentEmails) => {
    cy.wrap(sentEmails).should('have.length', 1)
    cy.wrap(sentEmails[0].recipients[0].email).should('equal', email)
    cy.wrap(sentEmails[0].subject).should('contain', 'Rappel constitution garantie financière')
  })
})
