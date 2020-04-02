// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('findContaining', (parentSelector, searchTerm) => {
  return cy.get(parentSelector).contains(parentSelector, searchTerm)
})

// Cypress.Commands.add('getTestId', (testId) => {
//   return cy.get('[data-testid=' + testId + ']')
// })

// Cypress.Commands.add(
//   'parentWithTestId',
//   { prevSubject: true },
//   (element, testId) => {
//     return element.parent('[data-testid=' + testId + ']')
//   }
// )

// Cypress.Commands.add('findTestId', { prevSubject: true }, (element, testId) => {
//   return element.find('[data-testid=' + testId + ']')
// })

Cypress.Commands.add('insertProjectsForUser', (projects) => {
  return cy.request({
    method: 'POST',
    url: '/test/addProjects',
    body: {
      projects,
    },
  })
})
