import { UniqueEntityID } from '../../../../core/domain'
import { User } from '../../../../entities'
import { resetDatabase } from '../../helpers'
import { ProjectEvent } from '../../projectionsNext'
import { getProjectEvents } from './getProjectEvents'

describe('frise.getProjectEvents', () => {
  const projectId = new UniqueEntityID().toString()

  for (const role of ['admin', 'dgec']) {
    describe(`when the user is ${role}`, () => {
      const fakeUser = { role } as User
      it('should return the ProjectImported event', async () => {
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
              variant: role,
            },
          ],
        })
      })
    })
  }

  for (const role of ['porteur-projet', 'dreal']) {
    describe(`when the user is ${role}`, () => {
      const fakeUser = { role } as User
      it('should not return the ProjectImported event', async () => {
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
  }
})
