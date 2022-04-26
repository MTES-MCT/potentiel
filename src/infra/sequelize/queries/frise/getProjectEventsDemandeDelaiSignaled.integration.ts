import { User } from '@entities'
import { UniqueEntityID } from '@core/domain'
import { USER_ROLES } from '@modules/users'
import { getProjectEvents } from '.'
import { ProjectEvent } from '../../projectionsNext'
import { resetDatabase } from '../../helpers'
import { models } from '../../models'
import makeFakeProject from '../../../../__tests__/fixtures/project'

describe('getProjectEvents for DemandeDelaiSignaled events', () => {
  const { Project } = models
  const projectId = new UniqueEntityID().toString()
  const fakeProject = makeFakeProject({ id: projectId, potentielIdentifier: 'pot-id' })

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(fakeProject)
  })
  describe('when there are demande delai signaled event', () => {
    describe('when user is not ademe', () => {
      for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
        describe(`when the user is ${role}`, () => {
          const fakeUser = { role } as User

          it('should return demande delai signaled event', async () => {
            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              projectId,
              type: 'DemandeDelaiSignaled',
              valueDate: new Date('2022-02-09').getTime(),
              eventPublishedAt: new Date('2022-02-09').getTime(),
              payload: {
                signaledBy: 'user-id',
                status: 'acceptée',
                isNewDateApplicable: true,
                newCompletionDueOn: new Date('2025-01-31').getTime(),
                attachment: { id: 'file-id', name: 'file-name' },
                notes: 'notes',
              },
            })

            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              projectId,
              type: 'DemandeDelaiSignaled',
              valueDate: new Date('2022-03-09').getTime(),
              eventPublishedAt: new Date('2022-03-09').getTime(),
              payload: {
                signaledBy: 'user-id',
                status: 'rejetée',
                isNewDateApplicable: false,
                newCompletionDueOn: new Date('2026-01-31').getTime(),
                attachment: { id: 'file-id', name: 'file-name' },
                notes: 'notes',
              },
            })

            const result = await getProjectEvents({ projectId, user: fakeUser })
            expect(result._unsafeUnwrap()).toMatchObject({
              events: expect.arrayContaining([
                {
                  type: 'DemandeDelaiSignaled',
                  variant: role,
                  date: new Date('2022-02-09').getTime(),
                  signaledBy: 'user-id',
                  status: 'acceptée',
                  isNewDateApplicable: true,
                  newCompletionDueOn: new Date('2025-01-31').getTime(),
                  attachment: { id: 'file-id', name: 'file-name' },
                  ...(['admin', 'dgec', 'dreal'].includes(role) && { notes: 'notes' }),
                },
                {
                  type: 'DemandeDelaiSignaled',
                  variant: role,
                  date: new Date('2022-03-09').getTime(),
                  signaledBy: 'user-id',
                  status: 'rejetée',
                  isNewDateApplicable: false,
                  newCompletionDueOn: new Date('2026-01-31').getTime(),
                  attachment: { id: 'file-id', name: 'file-name' },
                  ...(['admin', 'dgec', 'dreal'].includes(role) && { notes: 'notes' }),
                },
              ]),
            })
          })
        })
      }
    })
    describe('when the user is ademe', () => {
      it('should not return the demande delai signaled event', async () => {
        const fakeUser = { role: 'ademe' } as User

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'DemandeDelaiSignaled',
          valueDate: new Date('2022-02-09').getTime(),
          eventPublishedAt: new Date('2022-02-09').getTime(),
          payload: {
            signaledBy: 'user-id',
            status: 'acceptée',
            isNewDateApplicable: true,
            newCompletionDueOn: new Date('2025-01-31').getTime(),
            attachment: { id: 'file-id', name: 'file-name' },
            notes: 'notes',
          },
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'DemandeDelaiSignaled',
          valueDate: new Date('2022-03-09').getTime(),
          eventPublishedAt: new Date('2022-03-09').getTime(),
          payload: {
            signaledBy: 'user-id',
            status: 'rejetée',
            isNewDateApplicable: false,
            newCompletionDueOn: new Date('2026-01-31').getTime(),
            attachment: { id: 'file-id', name: 'file-name' },
            notes: 'notes',
          },
        })

        const result = await getProjectEvents({ projectId, user: fakeUser })
        const { events } = result._unsafeUnwrap()
        expect(events).toHaveLength(0)
      })
    })
  })
})
