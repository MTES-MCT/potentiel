import { makeNotificationService } from './NotificationService'
import { SendEmailProps } from './SendEmail'
import { okAsync, errAsync, UnwrapForTest } from '@core/utils'
import { Notification, NotificationArgs } from './Notification'
import { DomainError, UniqueEntityID } from '@core/domain'
import { InfraNotAvailableError } from '../shared'

describe('NotificationService', () => {
  const sendEmail = jest.fn((props: SendEmailProps) => okAsync<null, Error>(null))

  const fakeProps: NotificationArgs = {
    message: {
      email: 'email@test.test',
      name: 'testname',
      subject: 'testsubject',
    },
    type: 'designation',
    context: {
      appelOffreId: '',
      periodeId: '',
    },
    variables: {
      invitation_link: 'resetLink',
    },
  }

  describe('retryFailedNotifications()', () => {
    const getFailedNotificationsForRetry = jest.fn(() =>
      okAsync<any, InfraNotAvailableError>([
        { id: new UniqueEntityID('notifA'), isObsolete: false },
        { id: new UniqueEntityID('notifB'), isObsolete: false },
      ])
    )
    const fakeNotifA = UnwrapForTest(Notification.create(fakeProps))
    const fakeNotifB = UnwrapForTest(Notification.create(fakeProps))
    const notificationRepo = {
      save: jest.fn((notification: Notification) => okAsync<null, DomainError>(null)),
      load: jest.fn((id: UniqueEntityID) =>
        okAsync<Notification, InfraNotAvailableError>(
          id.toString() === 'notifA' ? fakeNotifA : fakeNotifB
        )
      ),
    }
    const notificationService = makeNotificationService({
      sendEmail,
      emailSenderAddress: 'sender@test.test',
      emailSenderName: 'fakeName',
      notificationRepo,
      getFailedNotificationsForRetry,
    })

    beforeAll(async () => {
      const retryiedNotifications = await notificationService.retryFailedNotifications()
      expect(retryiedNotifications).toEqual(2)
    })

    it('should retrieve all failed notifications', () => {
      expect(getFailedNotificationsForRetry).toHaveBeenCalled()

      expect(notificationRepo.load).toHaveBeenCalledWith(new UniqueEntityID('notifA'))
      expect(notificationRepo.load).toHaveBeenCalledWith(new UniqueEntityID('notifB'))
    })

    it('should create a new notification and send it for each failed notification', () => {
      expect(sendEmail).toHaveBeenCalledTimes(2)
      const sentNotificationIds = sendEmail.mock.calls.map((item) => item[0].id.toString())

      expect(sentNotificationIds).not.toContain(fakeNotifA.id.toString())
      expect(sentNotificationIds).not.toContain(fakeNotifB.id.toString())
    })

    it('should update the status of each failed notification to retried', () => {
      expect(notificationRepo.save).toHaveBeenCalledTimes(4) // 2 for failed, 2 for new ones

      const updatedNotificationIds = notificationRepo.save.mock.calls.map((item) =>
        item[0].id.toString()
      )
      expect(updatedNotificationIds).toContain(fakeNotifA.id.toString())
      expect(updatedNotificationIds).toContain(fakeNotifB.id.toString())

      expect(fakeNotifA.status).toEqual('retried')
      expect(fakeNotifB.status).toEqual('retried')
    })
  })

  describe('send(props)', () => {
    describe('when sendEmail succeeds', () => {
      const sendEmail = jest.fn((props: SendEmailProps) => okAsync<null, Error>(null))
      const notificationRepo = {
        save: jest.fn((notification: Notification) => okAsync<null, DomainError>(null)),
        load: jest.fn(),
      }
      const getFailedNotificationsForRetry = jest.fn()
      const notificationService = makeNotificationService({
        sendEmail,
        emailSenderAddress: 'sender@test.test',
        emailSenderName: 'fakeName',
        notificationRepo,
        getFailedNotificationsForRetry,
      })

      beforeAll(async () => {
        await notificationService.sendNotification(fakeProps)
      })
      it('should send an email', () => {
        expect(sendEmail).toHaveBeenCalled()
        const sendEmailProps = sendEmail.mock.calls[0][0]

        expect(sendEmailProps.fromEmail).toEqual('sender@test.test')
        expect(sendEmailProps.recipients).toHaveLength(1)
        expect(sendEmailProps.recipients[0]).toEqual({
          email: fakeProps.message.email,
          name: fakeProps.message.name,
        })
        expect(sendEmailProps.type).toEqual(fakeProps.type)
        expect(sendEmailProps.variables).toEqual(fakeProps.variables)
      })

      it('should save a Notification entity with status = sent', () => {
        expect(notificationRepo.save).toHaveBeenCalled()
        const notification = notificationRepo.save.mock.calls[0][0]
        expect(notification.type).toEqual(fakeProps.type)
        expect(notification.status).toEqual('sent')
      })
    })

    describe('when sendEmail fails', () => {
      const sendEmail = jest.fn((props: SendEmailProps) => errAsync<null, Error>(new Error('oops')))
      const getFailedNotificationsForRetry = jest.fn()
      const notificationRepo = {
        save: jest.fn((notification: Notification) => okAsync<null, DomainError>(null)),
        load: jest.fn(),
      }
      const notificationService = makeNotificationService({
        sendEmail,
        emailSenderAddress: 'sender@test.test',
        emailSenderName: 'fakeName',
        notificationRepo,
        getFailedNotificationsForRetry,
      })

      beforeAll(async () => {
        await notificationService.sendNotification(fakeProps)
      })

      it('should save a Notification entity with status error and the error message', () => {
        expect(notificationRepo.save).toHaveBeenCalled()
        const notification = notificationRepo.save.mock.calls[0][0]
        expect(notification.type).toEqual(fakeProps.type)
        expect(notification.status).toEqual('error')
        expect(notification.error).toEqual('oops')
      })
    })
  })
})
