import { makeGetFailedNotifications } from './getFailedNotifications'
import models from '../../../models'
import { UniqueEntityID } from '../../../../../core/domain'
import { resetDatabase } from '../../../../../dataAccess'
import { v4 as uuid } from 'uuid'

const fakeNotificationArgs = {
  message: {
    email: 'email@test.test',
    name: 'testname',
    subject: 'testsubject',
  },
  type: 'password-reset',
  context: {
    passwordRetrievalId: 'passwordRetrievalId',
    userId: uuid(),
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
    await resetDatabase()
  })

  describe('getFailedNotifications()', () => {
    const notifId1 = uuid()
    const notifId2 = uuid()

    beforeAll(async () => {
      const NotificationModel = models.Notification
      await NotificationModel.create({
        ...fakeNotificationArgs,
        id: notifId1,
        status: 'error',
      })
      await NotificationModel.create({
        ...fakeNotificationArgs,
        id: notifId2,
        status: 'error',
      })
      await NotificationModel.create({
        ...fakeNotificationArgs,
        id: uuid(),
        status: 'sent',
      })
      await NotificationModel.create({
        ...fakeNotificationArgs,
        id: uuid(),
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
        expect.arrayContaining([notifId1, notifId2].map((idStr) => new UniqueEntityID(idStr)))
      )
    })
  })
})
