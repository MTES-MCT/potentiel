import { UniqueEntityID } from '@core/domain'
import { User } from '@entities'
import { USER_ROLES } from '@modules/users'
import { resetDatabase } from '../../helpers'
import { ProjectEvent } from '../../projectionsNext'
import { getProjectEvents } from './getProjectEvents'
import { models } from '../../models'
import makeFakeProject from '../../../../__tests__/fixtures/project'

describe('frise.getProjectEvents', () => {
  const eventTimestamp = new Date('2022-01-04').getTime()

  const { Project } = models
  const projectId = new UniqueEntityID().toString()
  const fakeProject = makeFakeProject({ id: projectId, potentielIdentifier: 'pot-id' })

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(fakeProject)
  })

  for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
    describe(`when the user is ${role}`, () => {
      it('should return the CovidDelayGranted event', async () => {
        const fakeUser = { role } as User
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'CovidDelayGranted',
          valueDate: eventTimestamp,
          eventPublishedAt: eventTimestamp,
        })

        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'CovidDelayGranted',
              date: eventTimestamp,
              variant: role,
            },
          ],
        })
      })
    })
  }

  describe(`when the user is ademe`, () => {
    it('should NOT return the CovidDelayGranted event', async () => {
      const fakeUser = { role: 'ademe' } as User
      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'CovidDelayGranted',
        valueDate: eventTimestamp,
        eventPublishedAt: eventTimestamp,
      })

      const res = await getProjectEvents({ projectId, user: fakeUser })

      expect(res._unsafeUnwrap()).toMatchObject({
        events: [],
      })
    })
  })
})
