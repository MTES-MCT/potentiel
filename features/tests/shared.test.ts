import { After, Before, Given, When } from 'cucumber'

import { makeProject } from '../../src/entities'
import routes from '../../src/routes'
import { projectRepo, resetDatabase } from '../../src/server'
import makeFakeProject from '../../src/__tests__/fixtures/project'
import {
  ADMIN,
  PORTEUR_PROJET
} from '../../src/__tests__/fixtures/testCredentials'

import makeRoute from '../setup/makeRoute'
import createUser from '../setup/createUser'

Before(async function() {
  await this.newPage()
})

After(async function() {
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

Given('les projets suivants:', async function(dataTable) {
  // An array of Project-like objects
  this.projects = dataTable
    .hashes()
    .map(makeFakeProject) // complete projects with makeFakeProject
    .map(project => ({ ...project, id: undefined })) // Strip the id
    .map(makeProject)

  // insert them into the DB
  await projectRepo.insertMany(this.projects)
})

When('je me rends sur la page qui liste tous les projets', async function() {
  await this.page.goto(makeRoute(routes.ADMIN_LIST_PROJECTS))
})
