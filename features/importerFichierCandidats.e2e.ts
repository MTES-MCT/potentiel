import { defineFeature, loadFeature } from 'jest-cucumber'
import { Page } from 'puppeteer'

import fs from 'fs'
import util from 'util'
const writeFile = util.promisify(fs.writeFile)
const deleteFile = util.promisify(fs.unlink)

import makeRoute from './setup/makeRoute'

import routes from '../src/routes'
import { testId } from '../src/helpers/testId'
import { ADMIN } from '../src/__tests__/fixtures/testCredentials'

const feature = loadFeature('features/importerFichierCandidats.feature')

defineFeature(feature, test => {
  let page: Page
  const TEMP_CSV_FILE = 'temp/candidats.csv'

  beforeAll(async () => {
    page = await global['__BROWSER__'].newPage()
  })

  test('Importer un fichier de candidats', ({ given, and, when, then }) => {
    given('je suis un administrateur DGEC', async () => {
      await page.goto(makeRoute(routes.LOGIN))

      await expect(page).toMatch("Je m'identifie")

      await page.type(testId('login-email'), ADMIN.email)
      await page.type(testId('login-password'), ADMIN.password)

      await page.click(testId('login-submitButton'))

      expect(page.url()).toEqual(makeRoute(routes.ADMIN_DASHBOARD))
    })

    and("je suis sur la page d'import de candidats", async () => {
      await page.goto(makeRoute(routes.IMPORT_PROJECTS))
    })

    when(/^je saisis la période '(.*)'$/, async periode => {
      await page.type(testId('importProjects-periodeField'), periode)
    })

    and('je selectionne le fichier csv de la forme', async csvContents => {
      await writeFile(TEMP_CSV_FILE, csvContents, 'utf8')

      const inputUploadFile = await page.$(
        testId('importProjects-candidatsField')
      )

      expect(inputUploadFile).toBeDefined()

      if (!inputUploadFile) return

      await inputUploadFile.uploadFile(TEMP_CSV_FILE)

      // clean up on aisle 5
      await deleteFile(TEMP_CSV_FILE)
    })

    and('je valide le formulaire', async () => {
      await page.click(testId('importProjects-submitButton'))
    })

    then('le site me redirige vers la page de liste des projets', async () => {
      expect(page.url().indexOf(makeRoute(routes.LIST_PROJECTS))).toEqual(0)
    })

    and(/^me notifie la réussite par "(.*)"$/, async successMessage => {
      await expect(page).toMatchElement(
        testId('importProjects-successMessage'),
        {
          text: successMessage
        }
      )
    })
  })
})
