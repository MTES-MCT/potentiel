import makeLogin from './login'

import hashFn from '../helpers/hashPassword'

import { sequelize, checkIsDbReady } from '../../__tests__/inMemoryDb'

import buildMakeCredentials from '../entities/credentials'
const makeCredentials = buildMakeCredentials({ hashFn })

import makeCredentialsAccess from '../dataAccess/credentials'
import loadModels from '../dataAccess/models'

const { credentialsDb } = loadModels({ sequelize })
const isDbReady = checkIsDbReady()

const credentialsAccess = makeCredentialsAccess({
  isDbReady,
  credentialsDb
})
const login = makeLogin({ credentialsAccess, hashFn })

const phonyCredentials = {
  email: 'fake@example.fake',
  password: 'password',
  userId: '1'
}

describe('login use-case', () => {
  beforeAll(async () => {
    // Insert a phony user
    await credentialsAccess.insert(makeCredentials(phonyCredentials))
  })

  it('returns the userId if the email and password are correct', async () => {
    const { email, password, userId } = phonyCredentials
    const foundUserId = await login({
      email,
      password
    })

    expect(foundUserId).toEqual(userId)
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
