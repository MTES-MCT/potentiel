import { User } from '@entities'
import { UniqueEntityID } from '@core/domain'
import { USER_ROLES } from '@modules/users'
import { getProjectEvents } from '.'
import { ProjectEvent } from '../../projectionsNext'
import { resetDatabase } from '../../helpers'
import { models } from '../../models'
import makeFakeProject from '../../../../__tests__/fixtures/project'

describe('getProjectEvents for ModificationRequested events', () => {
  const { Project } = models
  const projectId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()
  const fakeProject = makeFakeProject({ id: projectId, potentielIdentifier: 'pot-id' })

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(fakeProject)
  })
  describe('when there are modifications requested of type delai, recours and abandon', () => {
    describe('when user is not ademe', () => {
      for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
        describe(`when the user is ${role}`, () => {
          const fakeUser = { role } as User

          it('should return modification requested events', async () => {
            const date = new Date('2022-02-09')

            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              projectId,
              type: 'ModificationRequested',
              valueDate: date.getTime(),
              eventPublishedAt: date.getTime(),
              payload: {
                modificationType: 'delai',
                modificationRequestId,
                delayInMonths: 10,
                authority: 'dreal',
              },
            })

            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              projectId,
              type: 'ModificationRequested',
              valueDate: date.getTime(),
              eventPublishedAt: date.getTime(),
              payload: {
                modificationType: 'recours',
                modificationRequestId,
                authority: 'dgec',
              },
            })

            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              projectId,
              type: 'ModificationRequested',
              valueDate: date.getTime(),
              eventPublishedAt: date.getTime(),
              payload: {
                modificationType: 'abandon',
                modificationRequestId,
                authority: 'dgec',
              },
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
                  authority: 'dreal',
                },
                {
                  type: 'ModificationRequested',
                  date: date.getTime(),
                  variant: role,
                  modificationType: 'recours',
                  modificationRequestId,
                  authority: 'dgec',
                },
                {
                  type: 'ModificationRequested',
                  date: date.getTime(),
                  variant: role,
                  modificationType: 'abandon',
                  modificationRequestId,
                  authority: 'dgec',
                },
              ],
            })
          })
        })
      }
    })
    describe('when the user is ademe', () => {
      it('should not return the modification requested event', async () => {
        const fakeUser = { role: 'ademe' } as User
        const date = new Date('2022-02-09')
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationRequested',
          valueDate: date.getTime(),
          eventPublishedAt: date.getTime(),
          payload: {
            modificationType: 'delai',
            modificationRequestId,
            delayInMonths: 10,
            authority: 'dgec',
          },
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationRequested',
          valueDate: date.getTime(),
          eventPublishedAt: date.getTime(),
          payload: {
            modificationType: 'recours',
            modificationRequestId,
            authority: 'dgec',
          },
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationRequested',
          valueDate: date.getTime(),
          eventPublishedAt: date.getTime(),
          payload: {
            modificationType: 'abandon',
            modificationRequestId,
            authority: 'dgec',
          },
        })

        const result = await getProjectEvents({ projectId, user: fakeUser })
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    })
  })

  describe('when there is a modification request accepted', () => {
    describe('when user is not ademe', () => {
      for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
        describe(`when the user is ${role}`, () => {
          const fakeUser = { role } as User

          it('should return a modification request accepted event', async () => {
            const date = new Date('2022-02-09')

            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              projectId,
              type: 'ModificationRequestAccepted',
              valueDate: date.getTime(),
              eventPublishedAt: date.getTime(),
              payload: { modificationRequestId, file: { id: 'file-id', name: 'filename' } },
            })

            const result = await getProjectEvents({ projectId, user: fakeUser })
            expect(result._unsafeUnwrap()).toMatchObject({
              events: [
                {
                  type: 'ModificationRequestAccepted',
                  date: date.getTime(),
                  variant: role,
                  modificationRequestId,
                  file: { id: 'file-id', name: 'filename' },
                },
              ],
            })
          })
        })
      }
    })
    describe('when the user is ademe', () => {
      it('should not return the modification request accepted event', async () => {
        const fakeUser = { role: 'ademe' } as User
        const date = new Date('2022-02-09')
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationRequestAccepted',
          valueDate: date.getTime(),
          eventPublishedAt: date.getTime(),
          payload: { modificationRequestId, file: { id: 'file-id', name: 'filename' } },
        })
        const result = await getProjectEvents({ projectId, user: fakeUser })
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    })
  })

  describe('when there is a modification request rejected', () => {
    describe('when user is not ademe', () => {
      for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
        describe(`when the user is ${role}`, () => {
          const fakeUser = { role } as User

          it('should return a modification request rejected event', async () => {
            const date = new Date('2022-02-09')

            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              projectId,
              type: 'ModificationRequestRejected',
              valueDate: date.getTime(),
              eventPublishedAt: date.getTime(),
              payload: { modificationRequestId, file: { id: 'file-id', name: 'filename' } },
            })

            const result = await getProjectEvents({ projectId, user: fakeUser })
            expect(result._unsafeUnwrap()).toMatchObject({
              events: [
                {
                  type: 'ModificationRequestRejected',
                  date: date.getTime(),
                  variant: role,
                  modificationRequestId,
                  file: { id: 'file-id', name: 'filename' },
                },
              ],
            })
          })
        })
      }
    })
    describe('when the user is ademe', () => {
      it('should not return the modification request rejected event', async () => {
        const fakeUser = { role: 'ademe' } as User
        const date = new Date('2022-02-09')
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationRequestRejected',
          valueDate: date.getTime(),
          eventPublishedAt: date.getTime(),
          payload: { modificationRequestId, file: { id: 'file-id', name: 'filename' } },
        })
        const result = await getProjectEvents({ projectId, user: fakeUser })
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    })
  })

  describe('when there is a modification request cancelled', () => {
    describe('when user is not ademe', () => {
      for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
        describe(`when the user is ${role}`, () => {
          const fakeUser = { role } as User

          it('should return a modification request cancelled event', async () => {
            const date = new Date('2022-02-09')

            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              projectId,
              type: 'ModificationRequestCancelled',
              valueDate: date.getTime(),
              eventPublishedAt: date.getTime(),
              payload: { modificationRequestId },
            })

            const result = await getProjectEvents({ projectId, user: fakeUser })
            expect(result._unsafeUnwrap()).toMatchObject({
              events: [
                {
                  type: 'ModificationRequestCancelled',
                  date: date.getTime(),
                  variant: role,
                  modificationRequestId,
                },
              ],
            })
          })
        })
      }
    })
    describe('when the user is ademe', () => {
      it('should not return the modification request cancelled event', async () => {
        const fakeUser = { role: 'ademe' } as User
        const date = new Date('2022-02-09')
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationRequestCancelled',
          valueDate: date.getTime(),
          eventPublishedAt: date.getTime(),
          payload: { modificationRequestId },
        })
        const result = await getProjectEvents({ projectId, user: fakeUser })
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    })
  })

  describe('when there is a modification request instruction started', () => {
    describe('when user is not ademe', () => {
      for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
        describe(`when the user is ${role}`, () => {
          const fakeUser = { role } as User

          it('should return a modification instruction started event', async () => {
            const date = new Date('2022-02-09')

            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              projectId,
              type: 'ModificationRequestInstructionStarted',
              valueDate: date.getTime(),
              eventPublishedAt: date.getTime(),
              payload: { modificationRequestId },
            })

            const result = await getProjectEvents({ projectId, user: fakeUser })
            expect(result._unsafeUnwrap()).toMatchObject({
              events: [
                {
                  type: 'ModificationRequestInstructionStarted',
                  date: date.getTime(),
                  variant: role,
                  modificationRequestId,
                },
              ],
            })
          })
        })
      }
    })
    describe('when the user is ademe', () => {
      it('should not return the modification instruction started event', async () => {
        const fakeUser = { role: 'ademe' } as User
        const date = new Date('2022-02-09')
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationRequestInstructionStarted',
          valueDate: date.getTime(),
          eventPublishedAt: date.getTime(),
          payload: { modificationRequestId },
        })
        const result = await getProjectEvents({ projectId, user: fakeUser })
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    })
  })
})
