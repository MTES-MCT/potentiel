import { expect } from 'chai'
import { Given, When, Then, BeforeAll, AfterAll, Before } from 'cucumber'

import fs from 'fs'
import util from 'util'
const writeFile = util.promisify(fs.writeFile)
const deleteFile = util.promisify(fs.unlink)

import routes from '../../src/routes'
import { testId } from '../../src/helpers/testId'

import makeRoute from '../setup/makeRoute'

When(
  'je click sur le bouton {string} au niveau de mon projet {string}',
  async function(intituleBouton, nomProjet) {
    await this.page.waitForSelector(testId('projectList-list'))

    const myProject = await this.page.$$eval(
      testId('projectList-item-nomProjet'),
      options => options.filter(option => option.textContent === nomProjet)
    )

    console.log(
      `je click sur le bouton ${intituleBouton} au niveau de mon projet ${nomProjet} ==> myProject is `,
      myProject
    )
  }
)

When('je saisis la valeur {string} dans le champ {string}', async function(
  valeur,
  champ
) {})

Then('je suis redirigé vers la page qui liste mes demandes', async function() {
  expect(
    this.page.url().indexOf(makeRoute(routes.USER_LIST_DEMANDES))
  ).to.equal(0)
})

Then(
  'je vois ma demande de modification {string} pour mon projet {string}',
  async function(typeDemande, nomProjet) {}
)
