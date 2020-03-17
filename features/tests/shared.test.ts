import { expect } from 'chai'
import { Given, When, Then, BeforeAll, AfterAll, Before, After } from 'cucumber'

import {
  ADMIN,
  PORTEUR_PROJET
} from '../../src/__tests__/fixtures/testCredentials'
import makeFakeProject from '../../src/__tests__/fixtures/project'
import routes from '../../src/routes'
import { testId } from '../../src/helpers/testId'

import {
  credentialsRepo,
  userRepo,
  projectRepo,
  resetDatabase
} from '../../src/server'

import {
  makeUser,
  makeCredentials,
  makeProject,
  User,
  Credentials
} from '../../src/entities'

import makeRoute from '../setup/makeRoute'

Before(async function() {
  await this.newPage()
})

After(async function() {
  await resetDatabase()
})

interface UserProps {
  firstName: User['firstName']
  lastName: User['lastName']
  email: Credentials['email']
  password: string
}

const createUser = async (user: UserProps, role: User['role']) => {
  const userId = await userRepo.insert(
    makeUser({
      firstName: user.firstName,
      lastName: user.lastName,
      role
    })
  )

  await credentialsRepo.insert(
    makeCredentials({
      email: user.email,
      password: user.password,
      userId
    })
  )

  return userId
}

Given('je suis un administrateur DGEC', async function() {
  // Create the test user
  this.userId = await createUser(ADMIN, 'dgec')

  await this.navigateTo(makeRoute(routes.LOGIN))

  console.log('page is at', this.page.url())

  await this.page.type(testId('login-email'), ADMIN.email)
  await this.page.type(testId('login-password'), ADMIN.password)

  await this.page.click(testId('login-submitButton'))

  expect(this.page.url()).to.be.equal(makeRoute(routes.ADMIN_DASHBOARD))
})

Given('je suis un porteur de projet', async function() {
  // Create the test user
  this.userId = await createUser(PORTEUR_PROJET, 'porteur-projet')

  await this.navigateTo(makeRoute(routes.LOGIN))

  console.log('page is at', this.page.url())

  await this.page.type(testId('login-email'), PORTEUR_PROJET.email)
  await this.page.type(testId('login-password'), PORTEUR_PROJET.password)

  await this.page.click(testId('login-submitButton'))

  expect(this.page.url()).to.be.equal(makeRoute(routes.USER_DASHBOARD))
})

Given("un porteur de projet inscrit avec l'adresse {string}", async function(
  email
) {
  // Create a user with a specific email
  this.userId = await createUser({ ...PORTEUR_PROJET, email }, 'porteur-projet')
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

When('je me rends sur la page qui liste les projets', async function() {
  await this.page.goto(makeRoute(routes.LIST_PROJECTS))
})
