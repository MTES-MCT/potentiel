import { expect } from 'chai'
import { Given, When, Then } from 'cucumber'

import routes from '../../src/routes'
import { testId } from '../../src/helpers/testId'

import createUser from '../setup/createUser'
import makeRoute from '../setup/makeRoute'
import { PORTEUR_PROJET } from '../../src/__tests__/fixtures/testCredentials'

Given("un porteur de projet inscrit avec l'adresse {string}", async function (
  email
) {
  this.porteurProjet = { ...PORTEUR_PROJET, email }

  // Create a user with a specific email
  await createUser(this.porteurProjet, 'porteur-projet')
})

When('je clique sur le bouton pour notifier les candidats', async function () {
  await this.page.click(testId('send-candidate-notifications-button'))
})

Then('une notification est générée pour chaque projet', async function () {
  await this.page.waitForSelector(testId('item-action'))

  // console.log("J'ai trouvé le item-action")

  const projectActions = await this.page.$$eval(
    testId('item-action'),
    (actionElements) =>
      actionElements.map((actionElement) => actionElement.getAttribute('href'))
  )

  expect(
    projectActions.filter(
      (action) => action.indexOf(routes.CANDIDATE_NOTIFICATION) === 0
    )
  ).to.have.lengthOf(this.projects.length)
})

Then(
  'le porteur de projet inscrit voit ses nouveaux projets dans sa liste',
  async function () {
    // Login as porteur de projet
    await this.loginAs(this.porteurProjet)

    // go to list projects page
    await this.navigateTo(makeRoute(routes.USER_LIST_PROJECTS))

    // check if the imported projects are there (use World.importedProjects)
    const userProjects = this.projects.filter(
      (project) => project.email === this.porteurProjet.email
    )

    // console.log('USER LIST PROJECTS contents', await this.page.content())

    await this.page.waitForSelector(testId('projectList-item-nomProjet'))

    const projectsInList = await this.page.$$eval(
      testId('projectList-item-nomProjet'),
      (actionElements) =>
        actionElements.map((actionElement) => actionElement.innerText)
    )

    // console.log('Found projectsInList', projectsInList)

    expect(projectsInList).to.have.lengthOf(userProjects.length)

    expect(projectsInList).to.include.members(
      userProjects.map((project) => project.nomProjet)
    )
  }
)
