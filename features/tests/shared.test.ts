import { expect } from 'chai'
import { Given, When, Then, BeforeAll, AfterAll, Before } from 'cucumber'

import { ADMIN } from '../../src/__tests__/fixtures/testCredentials'
import routes from '../../src/routes'
import { testId } from '../../src/helpers/testId'

import makeRoute from '../setup/makeRoute'

Before(async function() {
  await this.newPage()
})

Given('je suis un administrateur DGEC', async function() {
  await this.navigateTo(makeRoute(routes.LOGIN))

  // const found = await page.evaluate(function() {
  //   window.find("Je m'identifie")
  // })

  console.log('page is at', this.page.url())

  await this.page.type(testId('login-email'), ADMIN.email)
  await this.page.type(testId('login-password'), ADMIN.password)

  await this.page.click(testId('login-submitButton'))

  expect(this.page.url()).to.be.equal(makeRoute(routes.ADMIN_DASHBOARD))
})
