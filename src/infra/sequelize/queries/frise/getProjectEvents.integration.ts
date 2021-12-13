import { UniqueEntityID } from '../../../../core/domain'
import { User } from '../../../../entities'
import { USER_ROLES } from '../../../../modules/users'
import { resetDatabase } from '../../helpers'
import { ProjectEvent } from '../../projectionsNext'
import { getProjectEvents } from './getProjectEvents'

describe('frise.getProjectEvents', () => {
  const projectId = new UniqueEntityID().toString()

  describe('when the user is dgec', () => {
    it('should return the ProjectImported event', async () => {
      const fakeUser = { role: 'dgec' } as User
      await resetDatabase()

      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectImported',
        valueDate: 1234,
      })

      const res = await getProjectEvents({ projectId, user: fakeUser })

      expect(res._unsafeUnwrap()).toMatchObject({
        events: [
          {
            type: 'ProjectImported',
            date: 1234,
            variant: 'dgec',
          },
        ],
      })
    })
  })

  describe('when the user is porteur-projet', () => {
    it('should not return the ProjectImported event', async () => {
      const fakeUser = { role: 'porteur-projet' } as User
      await resetDatabase()

      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectImported',
        valueDate: 1234,
      })

      const res = await getProjectEvents({ projectId, user: fakeUser })

      expect(res._unsafeUnwrap()).toMatchObject({
        events: [],
      })
    })
  })

  for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
    describe(`when the user is ${role}`, () => {
      const fakeUser = { role } as User
      it('should return the ProjectNotified event', async () => {
        await resetDatabase()

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ProjectNotified',
          valueDate: 1234,
        })

        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ProjectNotified',
              date: 1234,
              variant: role,
            },
          ],
        })
      })
    })
  }

  describe(`when the user is ademe`, () => {
    const fakeUser = { role: 'ademe' } as User
    it('should not return the ProjectNotified event', async () => {
      await resetDatabase()

      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectNotified',
        valueDate: 1234,
      })

      const res = await getProjectEvents({ projectId, user: fakeUser })

      expect(res._unsafeUnwrap()).toMatchObject({
        events: [],
      })
    })
  })
})
