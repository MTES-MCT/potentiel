import { expect } from 'chai'
import { Given, When, Then } from 'cucumber'

import routes from '../../src/routes'
import { testId } from '../../src/helpers/testId'

import { sendCandidateNotifications } from '../../src/useCases'

import createUser from '../setup/createUser'
import makeRoute from '../setup/makeRoute'
import { PORTEUR_PROJET } from '../../src/__tests__/fixtures/testCredentials'
import { projectRepo, projectAdmissionKeyRepo } from '../../src/server'

Given('je suis un porteur de projet sans compte', function() {
  // Nothing to do here
})

Given('les notifications ont été envoyées aux candidats', async function() {
  // create the activation link by sending all notifications
  await sendCandidateNotifications({})
})

When(
  "je clique sur le lien d'activation reçu à l'adresse {string}",
  async function(email) {
    // Find a project from this user
    const userProjects = await projectRepo.findAll({
      email
    })

    expect(userProjects).to.have.length.of.at.least(1)

    // Find the activation link for this user
    const projectAdmissionKeys = await projectAdmissionKeyRepo.findAll({
      projectId: userProjects[0].id
    })

    expect(projectAdmissionKeys).to.have.lengthOf(1)

    const projectAdmissionKey = projectAdmissionKeys[0]
    this.currentProject = userProjects[0]

    await this.navigateTo(
      makeRoute(
        routes.PROJECT_INVITATION(
          projectAdmissionKey.id,
          projectAdmissionKey.projectId
        )
      )
    )
  }
)
When("je crée un compte avec l'adresse {string}", async function(email) {
  this.currentEmail = email

  await this.page.waitForSelector(testId('signup-form'))

  await this.page.type(testId('signup-lastName-field'), PORTEUR_PROJET.lastName)
  await this.page.type(
    testId('signup-firstName-field'),
    PORTEUR_PROJET.firstName
  )
  await this.page.type(testId('signup-email-field'), email)
  await this.page.type(testId('signup-password-field'), PORTEUR_PROJET.password)
  await this.page.type(
    testId('signup-confirm-password-field'),
    PORTEUR_PROJET.password
  )

  await this.page.click(testId('signup-submit-button'))
})
When('je me rends sur la page qui liste mes projets', async function() {
  await this.navigateTo(makeRoute(routes.USER_DASHBOARD))
})

Then(
  'je vois les projets associés à mon email dans ma liste',
  async function() {
    await this.page.waitForSelector(testId('projectList-item-nomProjet'))

    const projectsInList = await this.page.$$eval(
      testId('projectList-item-nomProjet'),
      actionElements =>
        actionElements.map(actionElement => actionElement.innerText)
    )

    const userProjects = this.projects.filter(
      project => project.email === this.currentEmail
    )

    expect(projectsInList).to.have.lengthOf(userProjects.length)

    expect(projectsInList).to.include.members(
      userProjects.map(project => project.nomProjet)
    )
  }
)

Then(
  "je vois uniquement le projet correspondant au lien que j'ai cliqué",
  async function() {
    await this.page.waitForSelector(testId('projectList-item-nomProjet'))

    const projectsInList = await this.page.$$eval(
      testId('projectList-item-nomProjet'),
      actionElements =>
        actionElements.map(actionElement => actionElement.innerText)
    )

    expect(projectsInList).to.have.lengthOf(1)

    expect(projectsInList).to.include(this.currentProject.nomProjet)
  }
)
