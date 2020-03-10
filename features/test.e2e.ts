import { defineFeature, loadFeature } from 'jest-cucumber'
import { Page } from 'puppeteer'

const feature = loadFeature('features/test.feature')

defineFeature(feature, test => {
  let page: Page

  beforeAll(async () => {
    page = await global['__BROWSER__'].newPage()
  })

  test('juste un truc pour voir', ({ given, when, then }) => {
    given('je suis un utilisateur', async () => {
      console.log('given je suis un utilisateur')
    })

    given('je visite la bonne page', async () => {
      console.log('given je visite la bonne page')
      await page.goto('http://localhost:3001/hello')
    })

    when('je lance une action', async () => {
      console.log('when je lance une action')
    })

    then("l'appli doit faire quelque chose", async () => {
      console.log("then l'appli doit faire quelque chose")
      await expect(page.content()).resolves.toMatch(
        '<html><head></head><body>Hello, World!</body></html>'
      )
    })
  })
})
