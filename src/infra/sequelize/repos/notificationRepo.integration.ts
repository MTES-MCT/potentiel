import { NotificationRepo } from './notificationRepo'
import { Notification } from '../../../modules/notification'
import models from '../models'
import { resetDatabase } from '../../../dataAccess'
import { UniqueEntityID } from '../../../core/domain'

describe('Sequelize NotificationRepo', () => {
  const notificationRepo = new NotificationRepo(models)

  beforeAll(async () => {
    await resetDatabase()
  })

  describe('save(notification)', () => {
    let notification: Notification

    beforeAll(() => {
      const notificationResult = Notification.create({
        message: {
          email: 'email@test.test',
          name: 'testname',
          subject: 'testsubject',
        },
        type: 'password-reset',
        context: {
          passwordRetrievalId: 'passwordRetrievalId',
          userId: 'userId',
        },
        variables: {
          password_reset_link: 'resetLink',
        },
      })

      expect(notificationResult.isOk()).toBe(true)
      if (notificationResult.isErr()) return

      notification = notificationResult.value
    })

    it('should save the Notification to database', async () => {
      const saveResult = await notificationRepo.save(notification)

      if (saveResult.isErr()) console.log(saveResult.error.message)
      expect(saveResult.isOk()).toBe(true)

      const NotificationModel = models.Notification

      const retrievedNotification = await NotificationModel.findByPk(notification.id.toString())

      expect(retrievedNotification).toBeDefined()
      expect(retrievedNotification.type).toEqual('password-reset')
    })
  })

  describe('load(notificationId)', () => {
    describe('when the Notification exists', () => {
      const notificationId = new UniqueEntityID()

      beforeAll(async () => {
        const NotificationModel = models.Notification
        await NotificationModel.create({
          id: notificationId.toString(),
          message: {
            email: 'email@test.test',
            name: 'testname',
            subject: 'testsubject',
          },
          type: 'password-reset',
          context: {
            passwordRetrievalId: 'passwordRetrievalId',
            userId: 'userId',
          },
          variables: {
            password_reset_link: 'resetLink',
          },
          createdAt: Date.now(),
          status: 'sent',
        })
      })

      it('should return a Notification', async () => {
        const notificationResult = await notificationRepo.load(notificationId)
        expect(notificationResult.isOk()).toBe(true)

        if (notificationResult.isErr()) return

        const notification = notificationResult.value

        expect(notification).toBeInstanceOf(Notification)
        expect(notification.message.email).toEqual('email@test.test')
      })
    })
  })
})
