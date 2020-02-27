import makeLogin from './login'

import hashFn from '../helpers/hashPassword'

import { sequelize, checkIsDbReady } from '../../__tests__/inMemoryDb'

import buildMakeCredentials from '../entities/credentials'
const makeCredentials = buildMakeCredentials({ hashFn })

import makeCredentialsAccess from '../dataAccess/credentials'
import loadModels from '../dataAccess/models'
import makeUserAccess from '../dataAccess/user'

const { credentialsDb, userDb } = loadModels({ sequelize })
const isDbReady = checkIsDbReady()

const credentialsAccess = makeCredentialsAccess({
  isDbReady,
  credentialsDb
})
const userAccess = makeUserAccess({ isDbReady, userDb })
const login = makeLogin({ credentialsAccess, hashFn, userAccess })

const phonyCredentials = {
  email: 'fake@example.fake',
  password: 'password'
}

const phonyUser = {
  firstName: 'Patrice',
  lastName: 'Leconte',
  role: 1
}

describe('login use-case', () => {
  beforeAll(async () => {
    // Insert a phony user
    const user = await userAccess.insert(phonyUser)
    await credentialsAccess.insert(
      makeCredentials({ ...phonyCredentials, userId: user.id })
    )
  })

  it('returns the user if the email and password are correct', async () => {
    const { email, password } = phonyCredentials
    const foundUser = await login({
      email,
      password
    })

    expect(foundUser).toEqual(phonyUser)
  })

  it('returns null if the email is incorrect', async () => {
    const { password } = phonyCredentials
    const userId = await login({ email: 'wrong@email.com', password })

    expect(userId).toBeNull()
  })

  it('returns null if the password is incorrect', async () => {
    const { email } = phonyCredentials
    const userId = await login({ email, password: 'oops' })

    expect(userId).toBeNull()
  })
})
