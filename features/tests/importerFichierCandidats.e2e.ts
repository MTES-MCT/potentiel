import { defineFeature, loadFeature } from 'jest-cucumber'
import { Page } from 'puppeteer'

import fs from 'fs'
import util from 'util'
const writeFile = util.promisify(fs.writeFile)
const deleteFile = util.promisify(fs.unlink)

import routes from '../../src/routes'
import { testId } from '../../src/helpers/testId'
import { ERREUR_COLONNES } from '../../src/useCases/importProjects'

import { givenJeSuisAdmin } from './shared-steps'

import makeRoute from '../setup/makeRoute'
const feature = loadFeature('features/importerFichierCandidats.feature')

defineFeature(feature, test => {
  const TEMP_CSV_FILE = 'temp/candidats.csv'
  let page: Page

  beforeAll(async () => {
    page = await global['__BROWSER__'].newPage()
  })

  test('Fichier au bon format', ({ given, and, when, then }) => {
    givenJeSuisAdmin(given, () => page)

    givenJeSuisSurLaPageImport(given)

    whenJeSaisisLaPeriode(when)

    whenJeSelectionneUnFichierCsv(when)

    whenJeValideLeFormulaire(when)

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

  test('Fichier au mauvais format', ({ given, and, when, then }) => {
    givenJeSuisAdmin(given, () => page)

    givenJeSuisSurLaPageImport(given)

    whenJeSaisisLaPeriode(when)

    whenJeSelectionneUnFichierCsv(when)

    whenJeValideLeFormulaire(when)

    then("le site reste sur la page d'import de candidats", async () => {
      expect(page.url().indexOf(makeRoute(routes.IMPORT_PROJECTS))).toEqual(0)
    })

    and(/^me notifie l'échec par "(.*)"$/, async errorMessage => {
      await expect(page).toMatchElement(testId('importProjects-errorMessage'), {
        text: ERREUR_COLONNES
      })
    })
  })

  // Re-used steps

  function givenJeSuisSurLaPageImport(given) {
    given("je suis sur la page d'import de candidats", async () => {
      await page.goto(makeRoute(routes.IMPORT_PROJECTS))
    })
  }

  function whenJeSaisisLaPeriode(when) {
    when(/^je saisis la période '(.*)'$/, async periode => {
      await page.type(testId('importProjects-periodeField'), periode)
    })
  }

  function whenJeSelectionneUnFichierCsv(when) {
    when('je selectionne le fichier csv de la forme', async csvContents => {
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
  }

  function whenJeValideLeFormulaire(when) {
    when('je valide le formulaire', async () => {
      await page.click(testId('importProjects-submitButton'))
    })
  }
})
