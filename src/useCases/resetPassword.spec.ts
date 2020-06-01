import makeResetPassword from './resetPassword'
import makeSignup from './signup'
import makeLogin from './login'
import {
  makeCredentials,
  makeProjectAdmissionKey,
  makePasswordRetrieval,
} from '../entities'
import {
  passwordRetrievalRepo,
  credentialsRepo,
  resetDatabase,
  projectAdmissionKeyRepo,
  projectRepo,
  userRepo,
} from '../dataAccess/inMemory'

const signup = makeSignup({
  userRepo,
  credentialsRepo,
  projectAdmissionKeyRepo,
  projectRepo,
})
const login = makeLogin({
  credentialsRepo,
  userRepo,
})
const resetPassword = makeResetPassword({
  passwordRetrievalRepo,
  credentialsRepo,
})

describe('resetPassword use-case', () => {
  const email = 'test@test.test'
  let resetCode: string

  beforeEach(async () => {
    resetDatabase()

    //
    // Set up a user account
    //

    // Add a projectAdmissionKey
    const [projectAdmissionKey] = (
      await Promise.all(
        [
          {
            id: 'phonyProjectAdmissionKey',
            email,
            fullName: 'fullname',
          },
        ]
          .map(makeProjectAdmissionKey)
          .filter((item) => item.is_ok())
          .map((item) => item.unwrap())
          .map(projectAdmissionKeyRepo.insert)
      )
    )
      .filter((item) => item.is_ok())
      .map((item) => item.unwrap())

    expect(projectAdmissionKey).toBeDefined()
    if (!projectAdmissionKey) return

    const signupResult = await signup({
      projectAdmissionKey: projectAdmissionKey.id,
      password: 'password',
      confirmPassword: 'password',
      fullName: 'fullname',
      email,
    })

    expect(signupResult.is_ok())

    // Check if login works
    const userResult = await login({
      email,
      password: 'password',
    })

    expect(userResult.is_ok()).toBeTruthy()
    if (userResult.is_err()) return

    //
    // Change the password
    //

    // Create a password retrieval
    const [passwordRetrieval] = (
      await Promise.all(
        [
          {
            email,
            createdOn: Date.now(),
          },
        ]
          .map(makePasswordRetrieval)
          .filter((item) => item.is_ok())
          .map((item) => item.unwrap())
          .map(passwordRetrievalRepo.insert)
      )
    )
      .filter((item) => item.is_ok())
      .map((item) => item.unwrap())

    expect(passwordRetrieval).toBeDefined()
    if (!passwordRetrieval) return

    resetCode = passwordRetrieval.id
  })

  it('should update the password', async () => {
    // Call resetPassword
    const resetPasswordResult = await resetPassword({
      resetCode,
      password: 'newPassword',
      confirmPassword: 'newPassword',
    })

    expect(resetPasswordResult.is_ok()).toBeTruthy()
    if (resetPasswordResult.is_err()) return

    // Check if login works with new password
    const newPasswordUserResult = await login({
      email,
      password: 'newPassword',
    })

    expect(newPasswordUserResult.is_ok()).toBeTruthy()
    if (newPasswordUserResult.is_err()) return

    // Check if old password still works
    const oldPasswordUserResult = await login({
      email,
      password: 'password',
    })

    expect(oldPasswordUserResult.is_err()).toBeTruthy()
  })

  it('should refuse to update password based on used resetCode', async () => {
    // Call resetPassword
    const resetPasswordResult = await resetPassword({
      resetCode,
      password: 'newPassword',
      confirmPassword: 'newPassword',
    })

    expect(resetPasswordResult.is_ok()).toBeTruthy()
    if (resetPasswordResult.is_err()) return

    // Call resetPassword again with same resetCode
    const secondResetPasswordResult = await resetPassword({
      resetCode,
      password: 'anotherPassword',
      confirmPassword: 'anotherPassword',
    })

    expect(secondResetPasswordResult.is_err()).toBeTruthy()
  })
})
