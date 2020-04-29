import { Before } from 'cypress-cucumber-preprocessor/steps'

Before(() => {
  cy.request({
    method: 'GET',
    url: '/test/reset',
  })
})

Before({ tags: '@porteur-projet' }, () => {
  cy.wrap('porteur-projet@test.test').as('userEmail')
  cy.login('porteur-projet@test.test', 'test')
})

Before({ tags: '@admin' }, () => {
  cy.wrap('admin@test.test').as('userEmail')
  cy.login('admin@test.test', 'test')
})
