import makeRetrievePassword, { RATE_LIMIT_REACHED } from './retrievePassword'
import { makeCredentials } from '../entities'
import {
  passwordRetrievalRepo,
  credentialsRepo,
  notificationRepo,
  resetDatabase,
} from '../dataAccess/inMemory'
import routes from '../routes'
import makeSendNotification from './sendNotification'
import {
  sendEmail,
  resetEmailStub,
  getCallsToEmailStub,
} from '../__tests__/fixtures/emailService'

const sendNotification = makeSendNotification({
  notificationRepo,
  sendEmail,
})

const retrievePassword = makeRetrievePassword({
  passwordRetrievalRepo,
  credentialsRepo,
  sendNotification,
})

describe('retrievePassword use-case', () => {
  let email
  beforeEach(async () => {
    resetDatabase()
    resetEmailStub()

    email = 'test@test.test'

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
  })

  it('should send an email with a password reset link', async () => {
    // Call use-case
    const res = await retrievePassword({ email })

    expect(res.is_ok()).toEqual(true)
    if (res.is_err()) return

    // Check if email has been sent
    const sentEmails = getCallsToEmailStub()
    expect(sentEmails).toHaveLength(1)
    expect(sentEmails[0].recipients[0].email).toEqual(email)
    expect(sentEmails[0].templateId).toEqual(1389166)
    expect(sentEmails[0].subject).toEqual(
      'Récupération de mot de passe Potentiel'
    )

    expect(sentEmails[0].variables).toHaveProperty('password_reset_link')

    // Check if it's for the right account
    const { password_reset_link } = sentEmails[0].variables
    const passwordRetrievalId: string = password_reset_link.substring(
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

  it('should return an error if there are already 5 or more password retrieval requests in the last 24hours', async () => {
    // Send 5 requests
    await retrievePassword({ email })
    await retrievePassword({ email })
    await retrievePassword({ email })
    await retrievePassword({ email })
    await retrievePassword({ email })

    resetEmailStub()
    const result = await retrievePassword({ email })

    expect(result.is_err()).toBeTruthy()
    expect(result.unwrap_err().message).toEqual(RATE_LIMIT_REACHED)

    const sentEmails = getCallsToEmailStub()
    expect(sentEmails).toHaveLength(0)
  })
})
