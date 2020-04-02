import { Before } from 'cypress-cucumber-preprocessor/steps'

Before(() => {
  cy.request({
    method: 'GET',
    url: '/test/reset',
  })
})

Before({ tags: '@porteur-projet' }, () => {
  cy.request({
    method: 'POST',
    url: '/login',
    body: {
      email: 'porteur-projet@test.test',
      password: 'test',
    },
    form: true,
  })
})

Before({ tags: '@admin' }, () => {
  cy.request({
    method: 'POST',
    url: '/login',
    body: {
      email: 'admin@test.test',
      password: 'test',
    },
    form: true,
  })
})
