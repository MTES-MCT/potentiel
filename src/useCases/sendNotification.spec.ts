import makeSendNotification, { EmailProps } from './sendNotification'
import {
  sendEmail,
  resetEmailStub,
  getCallsToEmailStub,
} from '../__tests__/fixtures/emailService'
import { notificationRepo, resetDatabase } from '../dataAccess/inMemory'
import { ErrorResult, ResultAsync } from '../types'

const sendNotification = makeSendNotification({ sendEmail, notificationRepo })

describe('sendNotification use-case', () => {
  beforeEach(async () => {
    process.env.SEND_EMAILS_FROM = 'admin@test.test'
    resetEmailStub()
    resetDatabase()
  })

  it('should send an email and save a Notification', async () => {
    await sendNotification({
      type: 'designation',
      message: {
        email: 'test@test.test',
        name: 'Bozo',
        subject: 'my subject',
      },
      context: {
        projectAdmissionKeyId: 'projectAdmissionKey123',
        appelOffreId: 'appelOffreId',
        periodeId: 'periodeId',
      },
      variables: {
        invitation_link: 'mylink',
      },
    })

    // Check if email has been sent and contents of email
    const sentEmails = getCallsToEmailStub()
    expect(sentEmails).toHaveLength(1)
    if (!sentEmails.length) return

    const sentEmail = sentEmails[0]
    expect(sentEmail.recipients).toHaveLength(1)
    expect(sentEmail.recipients[0]).toEqual({
      email: 'test@test.test',
      name: 'Bozo',
    })
    expect(sentEmail.fromEmail).toEqual('admin@test.test')
    expect(sentEmail.subject).toEqual('my subject')
    expect(sentEmail.templateId).toEqual(1350523)
    expect(sentEmail.variables).toEqual({
      invitation_link: 'mylink',
    })

    // Check notificationRepo.findAll() for a notification
    const notifications = await notificationRepo.findAll()
    expect(notifications).toHaveLength(1)
    const notification = notifications[0]
    expect(notification).toEqual(
      expect.objectContaining({
        status: 'sent',
        type: 'designation',
        message: {
          email: 'test@test.test',
          name: 'Bozo',
          subject: 'my subject',
        },
        context: {
          projectAdmissionKeyId: 'projectAdmissionKey123',
          projectId: 'projectId',
        },
        variables: {
          invitation_link: 'mylink',
        },
      })
    )
  })

  it('should save a Notification with an error status if process.env.SEND_EMAILS_FROM is missing', async () => {
    delete process.env.SEND_EMAILS_FROM

    await sendNotification({
      type: 'designation',
      message: {
        email: 'test@test.test',
        name: 'Bozo',
        subject: 'my subject',
      },
      context: {
        projectAdmissionKeyId: 'projectAdmissionKey123',
        appelOffreId: 'appelOffreId',
        periodeId: 'periodeId',
      },
      variables: {
        invitation_link: 'mylink',
      },
    })

    // Check if email has been sent and contents of email
    const sentEmails = getCallsToEmailStub()
    expect(sentEmails).toHaveLength(0)

    // Check notificationRepo.findAll() for a notification
    const notifications = await notificationRepo.findAll()
    expect(notifications).toHaveLength(1)
    const notification = notifications[0]
    expect(notification).toEqual(
      expect.objectContaining({
        status: 'error',
        error: 'Missing SEND_EMAILS_FROM environment variable',
        type: 'designation',
        message: {
          email: 'test@test.test',
          name: 'Bozo',
          subject: 'my subject',
        },
        context: {
          projectAdmissionKeyId: 'projectAdmissionKey123',
          appelOffreId: 'appelOffreId',
          periodeId: 'periodeId',
        },
        variables: {
          invitation_link: 'mylink',
        },
      })
    )
  })

  it('should save a Notification with an error status sendEmail returns an error', async () => {
    const sendEmailWithError = async (props: EmailProps): ResultAsync<void> => {
      return ErrorResult('sendEmail error')
    }

    // Build a new use-case with this sendEmailWithError
    const sendNotification = makeSendNotification({
      sendEmail: sendEmailWithError,
      notificationRepo,
    })

    await sendNotification({
      type: 'designation',
      message: {
        email: 'test@test.test',
        name: 'Bozo',
        subject: 'my subject',
      },
      context: {
        projectAdmissionKeyId: 'projectAdmissionKey123',
        appelOffreId: 'appelOffreId',
        periodeId: 'periodeId',
      },
      variables: {
        invitation_link: 'mylink',
      },
    })

    // Check notificationRepo.findAll() for a notification
    const notifications = await notificationRepo.findAll()
    expect(notifications).toHaveLength(1)
    const notification = notifications[0]
    expect(notification).toEqual(
      expect.objectContaining({
        status: 'error',
        error: 'sendEmail error',
        type: 'designation',
        message: {
          email: 'test@test.test',
          name: 'Bozo',
          subject: 'my subject',
        },
        context: {
          projectAdmissionKeyId: 'projectAdmissionKey123',
          appelOffreId: 'appelOffreId',
          periodeId: 'periodeId',
        },
        variables: {
          invitation_link: 'mylink',
        },
      })
    )
  })
})
