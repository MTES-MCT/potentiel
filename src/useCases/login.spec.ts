import makeLogin, {
  ERREUR_USER_INCONNU,
  ERREUR_MOT_DE_PASSE_ERRONE
} from './login'

import { makeCredentials, makeUser } from '../entities'

import { credentialsRepo, userRepo } from '../dataAccess/inMemory'

const login = makeLogin({ credentialsRepo, userRepo })

const phonyCredentials = {
  email: 'fake@example.fake',
  password: 'password'
}

describe('login use-case', () => {
  let phonyUser
  beforeAll(async () => {
    const phonyUserResult = makeUser({
      firstName: 'Patrice',
      lastName: 'Leconte',
      role: 'admin'
    })

    // Insert a phony user
    expect(phonyUserResult.is_ok())
    phonyUser = phonyUserResult.unwrap()

    await userRepo.insert(phonyUser)
    const credentialsResult = makeCredentials({
      ...phonyCredentials,
      userId: phonyUser.id
    })
    expect(credentialsResult.is_ok())
    await credentialsRepo.insert(credentialsResult.unwrap())
  })

  it('returns the user if the email and password are correct', async () => {
    const { email, password } = phonyCredentials
    const foundUserResult = await login({
      email,
      password
    })

    expect(foundUserResult.is_ok())
    expect(foundUserResult.unwrap()).toEqual(expect.objectContaining(phonyUser))
  })

  it('returns null if the email is incorrect', async () => {
    const { password } = phonyCredentials
    const userResult = await login({ email: 'wrong@email.com', password })

    expect(userResult.is_err())
    expect(userResult.unwrap_err().message).toEqual(ERREUR_USER_INCONNU)
  })

  it('returns null if the password is incorrect', async () => {
    const { email } = phonyCredentials
    const userResult = await login({ email, password: 'oops' })

    expect(userResult.is_err())
    expect(userResult.unwrap_err().message).toEqual(ERREUR_MOT_DE_PASSE_ERRONE)
  })
})
