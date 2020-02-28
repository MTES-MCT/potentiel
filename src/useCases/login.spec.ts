import makeLogin from './login'

import hashFn from '../helpers/hashPassword'

import { makeCredentials, makeUser } from '../entities'

import { credentialsRepo, userRepo } from '../dataAccess/inMemory'

const login = makeLogin({ credentialsRepo, hashFn, userRepo })

const phonyCredentials = {
  email: 'fake@example.fake',
  password: 'password'
}

const phonyUser = makeUser({
  firstName: 'Patrice',
  lastName: 'Leconte',
  role: 'admin'
})

describe('login use-case', () => {
  beforeAll(async () => {
    // Insert a phony user
    const userId = await userRepo.insert(phonyUser)
    await credentialsRepo.insert(
      makeCredentials({ ...phonyCredentials, userId })
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
