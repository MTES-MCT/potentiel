import { expect } from 'chai'
import { Given, When, Then, BeforeAll, AfterAll, Before } from 'cucumber'

import fs from 'fs'
import util from 'util'
const writeFile = util.promisify(fs.writeFile)
const deleteFile = util.promisify(fs.unlink)

import routes from '../../src/routes'
import { testId } from '../../src/helpers/testId'

import makeRoute from '../setup/makeRoute'

const TEMP_CSV_FILE = 'temp/candidats.csv'

Given("je suis sur la page d'import de candidats", async function() {
  // Write code here that turns the phrase above into concrete actions
  await this.navigateTo(makeRoute(routes.IMPORT_PROJECTS))
})

When('je saisis la période {string}', async function(periode) {
  await this.page.type(testId('importProjects-periodeField'), periode)
})

When('je selectionne le fichier csv de la forme', async function(csvContents) {
  await writeFile(TEMP_CSV_FILE, csvContents, 'utf8')

  const inputUploadFile = await this.page.$(
    testId('importProjects-candidatsField')
  )

  expect(inputUploadFile).to.not.be.null

  if (!inputUploadFile) return

  await inputUploadFile.uploadFile(TEMP_CSV_FILE)

  // clean up on aisle 5
  await deleteFile(TEMP_CSV_FILE)
})

// Bon format

Then('le site me redirige vers la page de liste des projets', async function() {
  expect(
    this.page.url().indexOf(makeRoute(routes.ADMIN_LIST_PROJECTS))
  ).to.equal(0)
})

// Mauvais format

Then("le site reste sur la page d'import de candidats", function() {
  expect(this.page.url().indexOf(makeRoute(routes.IMPORT_PROJECTS))).to.equal(0)
})
