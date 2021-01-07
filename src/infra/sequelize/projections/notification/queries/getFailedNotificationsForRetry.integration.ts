import { makeGetFailedNotificationsForRetry } from './getFailedNotificationsForRetry'
import models from '../../../models'
import { sequelize } from '../../../../../sequelize.config'
import { UniqueEntityID } from '../../../../../core/domain'

const fakeNotificationArgs = {
  message: {},
  context: {},
  variables: {},
  createdAt: Date.now(),
  status: 'sent',
}

describe('Sequelize getFailedNotificationsForRetry', () => {
  const getFailedNotificationsForRetry = makeGetFailedNotificationsForRetry(models)

  describe('getFailedNotificationsForRetry()', () => {
    describe('in general', () => {
      const targetId = new UniqueEntityID()

      beforeAll(async () => {
        await sequelize.sync({ force: true })

        const NotificationModel = models.Notification
        await NotificationModel.create({
          ...fakeNotificationArgs,
          id: targetId.toString(),
          type: 'password-reset',
          status: 'error',
        })
        await NotificationModel.create({
          ...fakeNotificationArgs,
          id: new UniqueEntityID().toString(),
          type: 'password-reset',
          status: 'sent',
        })
        await NotificationModel.create({
          ...fakeNotificationArgs,
          id: new UniqueEntityID().toString(),
          type: 'password-reset',
          status: 'retried',
        })
        await NotificationModel.create({
          ...fakeNotificationArgs,
          id: new UniqueEntityID().toString(),
          type: 'password-reset',
          status: 'cancelled',
        })
      })

      it('should return the notifications with status of error', async () => {
        const results = await getFailedNotificationsForRetry()

        expect(results._unsafeUnwrap()).toHaveLength(1)
        expect(results._unsafeUnwrap()).toEqual([{ id: targetId, isObsolete: false }])
      })
    })

    describe('when multiple password-reset for the same email, mark all but latest obsolete', () => {
      const obsoleteId = new UniqueEntityID()
      const stillCurrentId = new UniqueEntityID()
      const otherId = new UniqueEntityID()

      beforeAll(async () => {
        await sequelize.sync({ force: true })

        const NotificationModel = models.Notification
        await NotificationModel.create({
          ...fakeNotificationArgs,
          id: obsoleteId.toString(),
          type: 'password-reset',
          message: { email: 'target@test.test' },
          createdAt: new Date(1),
          status: 'error',
        })
        await NotificationModel.create({
          ...fakeNotificationArgs,
          id: stillCurrentId.toString(),
          type: 'password-reset',
          message: { email: 'target@test.test' },
          createdAt: new Date(2),
          status: 'error',
        })
        await NotificationModel.create({
          ...fakeNotificationArgs,
          id: otherId.toString(),
          type: 'password-reset',
          message: { email: 'other@test.test' },
          createdAt: new Date(3),
          status: 'error',
        })
      })

      it('should return the notifications with status of error', async () => {
        const results = await getFailedNotificationsForRetry()

        expect(results._unsafeUnwrap()).toHaveLength(3)
        expect(results._unsafeUnwrap()).toEqual([
          { id: otherId, isObsolete: false },
          { id: stillCurrentId, isObsolete: false },
          { id: obsoleteId, isObsolete: true },
        ])
      })
    })
  })
})
