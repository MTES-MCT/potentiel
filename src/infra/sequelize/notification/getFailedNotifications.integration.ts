import { makeGetFailedNotifications } from './getFailedNotifications'
import { Notification } from '../../../modules/notification'
import { v4 as uuid } from 'uuid'
import models from '../models'
import { sequelize } from '../../../sequelize.config'
import { UniqueEntityID } from '../../../core/domain'

const fakeNotificationArgs = {
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
}

describe('Sequelize getFailedNotifications', () => {
  const getFailedNotifications = makeGetFailedNotifications(models)

  beforeAll(async () => {
    // Create the tables and remove all data
    await sequelize.sync({ force: true })
  })

  describe('getFailedNotifications()', () => {
    beforeAll(async () => {
      const NotificationModel = models.Notification
      await NotificationModel.create({
        ...fakeNotificationArgs,
        id: '1',
        status: 'error',
      })
      await NotificationModel.create({
        ...fakeNotificationArgs,
        id: '2',
        status: 'error',
      })
      await NotificationModel.create({
        ...fakeNotificationArgs,
        id: '3',
        status: 'sent',
      })
      await NotificationModel.create({
        ...fakeNotificationArgs,
        id: '4',
        status: 'retried',
      })
    })

    it('should return the notifications with status of error', async () => {
      const results = await getFailedNotifications()

      expect(results.isOk()).toBe(true)
      if (results.isErr()) return

      const failedNotificationIds = results.value

      expect(failedNotificationIds).toHaveLength(2)
      expect(failedNotificationIds).toEqual(
        expect.arrayContaining(
          ['1', '2'].map((idStr) => new UniqueEntityID(idStr))
        )
      )
    })
  })
})
