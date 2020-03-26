import { expect } from 'chai'
import { After, Before, Given, When, Then } from 'cucumber'

import { Result } from '../../src/types'
import { makeProject, Project } from '../../src/entities'
import routes from '../../src/routes'
import { projectRepo, userRepo, resetDatabase } from '../../src/server'
import makeFakeProject from '../../src/__tests__/fixtures/project'
import toNumber from '../../src/helpers/toNumber'

import { testId } from '../../src/helpers/testId'
import {
  ADMIN,
  PORTEUR_PROJET
} from '../../src/__tests__/fixtures/testCredentials'

import makeRoute from '../setup/makeRoute'
import createUser from '../setup/createUser'
import project from '../../src/entities/project'

Before(async function() {
  await this.newPage()
})

After(async function() {
  await this.logout()
  await resetDatabase()
})

Given('je suis un administrateur DGEC', async function() {
  // Create the test user
  this.userId = await createUser(ADMIN, 'dgec')

  await this.loginAs(ADMIN)
})

Given('je suis un porteur de projet', async function() {
  // Create the test user
  this.userId = await createUser(PORTEUR_PROJET, 'porteur-projet')

  await this.loginAs(PORTEUR_PROJET)
})

async function addProjectsFromDataTable(dataTable) {
  const projectResults: Array<Result<Project, Error>> = await Promise.all(
    dataTable
      .hashes()
      .map(makeFakeProject) // complete projects with makeFakeProject
      .map(item => ({
        ...item,
        puissance: toNumber(item.puissance) || 0,
        prixReference: toNumber(item.prixReference) || 0,
        evaluationCarbone: toNumber(item.evaluationCarbone) || 0,
        note: toNumber(item.note) || 0
      }))
      .map(makeProject)
      .map(item => {
        if (item.is_err()) {
          console.log('Found error in makeProject', item.unwrap_err())
        }
        return item
      })
      .filter(item => item.is_ok())
      .map(item => item.unwrap())
      .map(projectRepo.insert)
  )

  expect(projectResults).to.have.lengthOf(dataTable.hashes().length)
  expect(projectResults.some(result => result.is_err())).to.be.false

  return projectResults.filter(item => item.is_ok()).map(item => item.unwrap())
}

Given('mon compte est lié aux projets suivants', async function(dataTable) {
  this.projects = await addProjectsFromDataTable(dataTable)

  expect(this.userId).to.not.be.undefined

  // Link them to the current user
  await Promise.all(
    this.projects.map(project => {
      userRepo.addProject(this.userId, project.id)
    })
  )

  const allProjects = await projectRepo.findAll()
  console.log('All projects', allProjects)
  console.log('this.userId', this.userId)

  // Make sure they are linked properly
  const userProjects = await projectRepo.findByUser(this.userId)
  console.log('userProjects', userProjects)
  expect(userProjects).to.have.lengthOf(this.projects.length)
})

Given('les projets suivants:', async function(dataTable) {
  this.projects = await addProjectsFromDataTable(dataTable)
})

When('je me rends sur la page qui liste tous les projets', async function() {
  await this.page.goto(makeRoute(routes.ADMIN_LIST_PROJECTS))
})

When('je me rends sur la page qui liste mes projets', async function() {
  await this.page.goto(makeRoute(routes.USER_LIST_PROJECTS))
})

When('je valide le formulaire', async function() {
  // Write code here that turns the phrase above into concrete actions
  // TODO: step will be reused, use a generic testId('submitButton') => should only have one per page ?
  await this.page.click(testId('submit-button'))
})

Then('me notifie la réussite par {string}', async function(successMessage) {
  // TODO: same as submit, use generic item
  const successElement = await this.page.waitForSelector(
    testId('success-message')
  )

  expect(successElement).to.not.be.null

  // console.log('successElement', successElement)

  const successText = await this.page.evaluate(
    element => element.textContent,
    successElement
  )
  expect(successText).to.equal(successMessage)
})

Then("me notifie l'échec par {string}", async function(errorMessage) {
  // TODO: same as submit, use generic item
  const errorElement = await this.page.waitForSelector(testId('error-message'))

  expect(errorElement).to.not.be.null

  // console.log('errorElement', errorElement)

  const errorText = await this.page.evaluate(
    element => element.textContent,
    errorElement
  )
  expect(errorText).to.equal(errorMessage)
})
