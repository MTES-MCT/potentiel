import { User } from '@entities'
import { UniqueEntityID } from '@core/domain'
import { USER_ROLES } from '@modules/users'
import { getProjectEvents } from '.'
import { ProjectEvent } from '../../projectionsNext'
import { resetDatabase } from '../../helpers'
import { models } from '../../models'
import makeFakeProject from '../../../../__tests__/fixtures/project'

describe('getProjectEvents for delay requests', () => {
  const { Project } = models
  const projectId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()
  const fakeProject = makeFakeProject({ id: projectId, potentielIdentifier: 'pot-id' })

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(fakeProject)
  })
  describe('when there is a modification request of type delai', () => {
    describe('when user is not ademe', () => {
      for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
        describe(`when the user is ${role}`, () => {
          const fakeUser = { role } as User
          it('should return a delay requested event', async () => {
            const date = new Date('2022-02-09')
            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              projectId,
              type: 'ModificationRequested',
              valueDate: date.getTime(),
              eventPublishedAt: date.getTime(),
              payload: { modificationType: 'delai', modificationRequestId, delayInMonths: 10 },
            })
            const result = await getProjectEvents({ projectId, user: fakeUser })
            expect(result._unsafeUnwrap()).toMatchObject({
              events: [
                {
                  type: 'ModificationRequested',
                  date: date.getTime(),
                  variant: role,
                  modificationType: 'delai',
                  modificationRequestId,
                  delayInMonths: 10,
                },
              ],
            })
          })
        })
      }
    })
    describe('when the user is ademe', () => {
      it('should not return the delay requested event', async () => {
        const fakeUser = { role: 'ademe' } as User
        const date = new Date('2022-02-09')
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationRequested',
          valueDate: date.getTime(),
          eventPublishedAt: date.getTime(),
          payload: { modificationType: 'delai', modificationRequestId, delayInMonths: 10 },
        })
        const result = await getProjectEvents({ projectId, user: fakeUser })
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    })
  })
})
