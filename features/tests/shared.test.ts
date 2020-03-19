import { expect } from 'chai'
import { After, Before, Given, When } from 'cucumber'

import { Result } from '../../src/types'
import { makeProject, Project } from '../../src/entities'
import routes from '../../src/routes'
import { projectRepo, resetDatabase } from '../../src/server'
import makeFakeProject from '../../src/__tests__/fixtures/project'
import toNumber from '../../src/helpers/toNumber'
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

Given('les projets suivants:', async function(dataTable) {
  // An array of Project-like objects
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

  this.projects = projectResults
    .filter(item => item.is_ok())
    .map(item => item.unwrap())
})

When('je me rends sur la page qui liste tous les projets', async function() {
  await this.page.goto(makeRoute(routes.ADMIN_LIST_PROJECTS))
})
