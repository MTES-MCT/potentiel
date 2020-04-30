import makeRetrievePassword from './retrievePassword'
import { makeCredentials } from '../entities'
import {
  passwordRetrievalRepo,
  credentialsRepo,
  resetDatabase,
} from '../dataAccess/inMemory'
import {
  resetEmailStub,
  sendPasswordResetEmail,
  getCallsToEmailStub,
} from '../__tests__/fixtures/passwordResetEmailService'
import routes from '../routes'

const retrievePassword = makeRetrievePassword({
  passwordRetrievalRepo,
  credentialsRepo,
  sendPasswordResetEmail,
})

describe('retrievePassword use-case', () => {
  beforeEach(async () => {
    resetDatabase()
    resetEmailStub()
  })

  it('should send an email with a password reset link', async () => {
    const email = 'test@test.test'

    // Create credentials
    const credentialsResult = makeCredentials({
      email,
      userId: 'fakeUser',
      password: 'test',
    })

    expect(credentialsResult.is_ok()).toBeTruthy()
    if (credentialsResult.is_err()) return

    const credentials = credentialsResult.unwrap()

    await credentialsRepo.insert(credentials)

    // Call use-case
    await retrievePassword({ email })

    // Check if email has been sent
    const sentEmails = getCallsToEmailStub()
    expect(sentEmails).toHaveLength(1)
    expect(sentEmails[0].email).toEqual(email)

    // Check if it's for the right account
    const { resetLink } = sentEmails[0]
    const passwordRetrievalId: string = resetLink.substring(
      routes.RESET_PASSWORD_LINK({ resetCode: '' }).length
    )
    const passwordRetrievalResult = await passwordRetrievalRepo.findById(
      passwordRetrievalId
    )

    expect(passwordRetrievalResult.is_some()).toBeTruthy()
    if (passwordRetrievalResult.is_none()) return

    const passwordRetrieval = passwordRetrievalResult.unwrap()

    expect(passwordRetrieval.email).toEqual(email)
  })

  it('should send no email if email is unknown', async () => {
    await retrievePassword({ email: 'bogus@test.test' })

    const sentEmails = getCallsToEmailStub()
    expect(sentEmails).toHaveLength(0)
  })
})
