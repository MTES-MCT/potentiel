import { Page } from 'puppeteer'

import routes from '../../src/routes'
import { testId } from '../../src/helpers/testId'
import { ADMIN } from '../../src/__tests__/fixtures/testCredentials'

import makeRoute from '../setup/makeRoute'

export const givenJeSuisAdmin = (given, getPage: () => Page) => {
  given('je suis un administrateur DGEC', async () => {
    const page = getPage()
    await page.goto(makeRoute(routes.LOGIN))

    await expect(page).toMatch("Je m'identifie")

    await page.type(testId('login-email'), ADMIN.email)
    await page.type(testId('login-password'), ADMIN.password)

    await page.click(testId('login-submitButton'))

    expect(page.url()).toEqual(makeRoute(routes.ADMIN_DASHBOARD))
  })
}
