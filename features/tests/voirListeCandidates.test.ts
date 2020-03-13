import { expect } from 'chai'
import { When, Then } from 'cucumber'

import routes from '../../src/routes'
import { testId } from '../../src/helpers/testId'

import makeRoute from '../setup/makeRoute'
When('je me rends sur la page qui liste les projets', async function() {
  await this.page.goto(makeRoute(routes.LIST_PROJECTS))
})

Then(
  'je vois une liste de projets, avec pour chaque projet les champs suivants:',
  async function(table) {
    const fields = table.rawTable[0]

    const found = await Promise.all(
      fields.map(field =>
        this.page.waitForSelector(testId(`projectList-item-${field}`))
      )
    )

    // expect to find them all
    expect(found.every(item => !!item)).to.be.true
  }
)
