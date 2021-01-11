import { makeGetFailedNotificationDetails } from './getFailedNotificationDetails'
import { sequelizeInstance } from '../../../sequelize.config'
import { UniqueEntityID } from '../../../core/domain'
import models from '../models'

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
  createdAt: new Date(123),
  status: 'sent',
}

describe('Sequelize getFailedNotificationDetails', () => {
  const getFailedNotificationDetails = makeGetFailedNotificationDetails(models)

  beforeAll(async () => {
    // Create the tables and remove all data
    await sequelizeInstance.sync({ force: true })
  })

  describe('getFailedNotificationDetails()', () => {
    const targetId = new UniqueEntityID().toString()

    beforeAll(async () => {
      const NotificationModel = models.Notification
      await NotificationModel.create({
        ...fakeNotificationArgs,
        id: targetId,
        createdAt: new Date(456),
        status: 'error',
        error: 'errorMessage',
      })
      await NotificationModel.create({
        ...fakeNotificationArgs,
        id: new UniqueEntityID().toString(),
        status: 'sent',
      })
      await NotificationModel.create({
        ...fakeNotificationArgs,
        id: new UniqueEntityID().toString(),
        status: 'retried',
      })
    })

    it('should return the details of the notifications with status of error', async () => {
      const pagination = {
        page: 0,
        pageSize: 50,
      }

      const { items, itemCount } = (await getFailedNotificationDetails(pagination))._unsafeUnwrap()

      expect(itemCount).toEqual(1)
      expect(items).toEqual([
        {
          id: targetId,
          recipient: {
            email: 'email@test.test',
            name: 'testname',
          },
          type: 'password-reset',
          createdAt: new Date(456),
          error: 'errorMessage',
        },
      ])
    })
  })
})
