import { expect } from 'chai'
import { When, Then } from 'cucumber'

import routes from '../../src/routes'
import { testId } from '../../src/helpers/testId'

import makeRoute from '../setup/makeRoute'
When('je clique sur le bouton pour notifier les candidats', async function() {
  await this.page.click(testId('send-candidate-notifications-button'))
})

Then('une notification est générée pour chaque projet', async function() {
  await this.page.waitForSelector(testId('projectList-item-action'))

  const projectActions = await this.page.$$eval(
    testId('projectList-item-action'),
    actionElements =>
      actionElements.map(actionElement => actionElement.getAttribute('href'))
  )

  expect(
    projectActions.filter(
      action => action.indexOf(routes.CANDIDATE_NOTIFICATION) === 0
    )
  ).to.have.lengthOf(this.projects.length)
})
