import { makeGetFailedNotificationsForRetry } from './getFailedNotificationsForRetry'
import models from '../models'
import { resetDatabase } from '../helpers'
import { UniqueEntityID } from '../../../core/domain'
import makeFakeProject from '../../../__tests__/fixtures/project'

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
        await resetDatabase()

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

        expect(results._unsafeUnwrap()).toEqual([{ id: targetId, isObsolete: false }])
      })
    })

    describe('when multiple password-reset for the same email', () => {
      const obsoleteId = new UniqueEntityID()
      const stillCurrentId = new UniqueEntityID()
      const otherId = new UniqueEntityID()

      beforeAll(async () => {
        await resetDatabase()

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

      it('should mark all but latest obsolete', async () => {
        const results = await getFailedNotificationsForRetry()

        expect(results._unsafeUnwrap()).toEqual([
          { id: otherId, isObsolete: false },
          { id: stillCurrentId, isObsolete: false },
          { id: obsoleteId, isObsolete: true },
        ])
      })
    })

    describe('when type is relance-gf', () => {
      const projectWithGFId = new UniqueEntityID()
      const obsoleteRelanceId = new UniqueEntityID()

      const projectWithoutGFId = new UniqueEntityID()
      const stillCurrentRelanceId = new UniqueEntityID()

      beforeAll(async () => {
        await resetDatabase()

        const { Project, ProjectStep } = models
        await Project.create(
          makeFakeProject({
            id: projectWithGFId.toString(),
          })
        )
        await ProjectStep.create({
          id: new UniqueEntityID().toString(),
          projectId: projectWithGFId.toString(),
          type: 'garantie-financiere',
          submittedOn: new Date(123),
          submittedBy: new UniqueEntityID().toString(),
          fileId: new UniqueEntityID().toString(),
          stepDate: new Date(345),
        })
        await Project.create(
          makeFakeProject({
            id: projectWithoutGFId.toString(),
          })
        )

        const NotificationModel = models.Notification
        await NotificationModel.create({
          ...fakeNotificationArgs,
          id: obsoleteRelanceId.toString(),
          type: 'relance-gf',
          context: { projectId: projectWithGFId.toString() },
          status: 'error',
        })
        await NotificationModel.create({
          ...fakeNotificationArgs,
          id: stillCurrentRelanceId.toString(),
          type: 'relance-gf',
          context: { projectId: projectWithoutGFId.toString() },
          status: 'error',
        })
      })

      it('should mark notifications for projects that have since submitted gf as obsolete', async () => {
        const results = await getFailedNotificationsForRetry()

        expect(results._unsafeUnwrap()).toEqual([
          { id: obsoleteRelanceId, isObsolete: true },
          { id: stillCurrentRelanceId, isObsolete: false },
        ])
      })
    })
  })
})
