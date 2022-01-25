import { getProjectEvents } from '.'
import { resetDatabase } from '../../helpers'
import { ProjectEvent } from '../../projectionsNext'
import { UniqueEntityID } from '@core/domain'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { models } from '../../models'
import { USER_ROLES } from '@modules/users'
import { User } from '@entities'

describe('getProjectEvents', () => {
  const { Project } = models
  const projectId = new UniqueEntityID().toString()
  const fakeProject = makeFakeProject({ id: projectId, potentielIdentifier: 'pot-id' })
  const valueDate = new Date('2024-01-01').getTime()
  const eventPublishedAt = new Date('2022-01-01').getTime()

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(fakeProject)
  })

  describe('When there is a ProjectCompletionDueDateSet event in ProjectEvent projection', () => {
    describe('when user is NOT ademe', () => {
      for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
        describe(`when user role is ${role}`, () => {
          it('should return this ProjectCompletionDueDateSet event', async () => {
            const fakeUser = { role } as User
            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              type: 'ProjectCompletionDueDateSet',
              valueDate,
              eventPublishedAt,
              projectId,
            })
            const result = await getProjectEvents({ projectId, user: fakeUser })
            expect(result._unsafeUnwrap()).toMatchObject({
              events: [{ type: 'ProjectCompletionDueDateSet', date: valueDate, variant: role }],
            })
          })
        })
      }
    })
    describe('when user is ademe', () => {
      it('should not return this event', async () => {
        const fakeUser = { role: 'ademe' } as User
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          type: 'ProjectCompletionDueDateSet',
          valueDate,
          eventPublishedAt,
          projectId,
        })
        const result = await getProjectEvents({ projectId, user: fakeUser })
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    })
  })
})
