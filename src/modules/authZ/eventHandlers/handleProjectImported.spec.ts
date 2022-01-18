import { ProjectImported, ProjectReimported } from '../../project'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { handleProjectImported } from './handleProjectImported'
import { EventBus, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeFakeEventBus } from '../../../__tests__/fixtures/aggregates/fakeEventBus'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { User } from '@entities'
import { UserRightsToProjectGranted } from '..'
import { InfraNotAvailableError } from '../../shared'

describe('authZ handleProjectImported', () => {
  describe('when receiving a ProjectImported event', () => {
    it('should trigger UserRightsToProjectGranted', async () => {
      const projectId = new UniqueEntityID().toString()
      const userId = new UniqueEntityID().toString()
      const user = { ...makeFakeUser(), id: userId } as User
      const getUserByEmail = jest.fn((email: string) =>
        okAsync<User | null, InfraNotAvailableError>(user)
      )
      const eventBus = makeFakeEventBus()
      const isPeriodeLegacy = jest.fn(() => Promise.resolve(false))
      const fakeProject = makeFakeProject({ id: projectId, email: 'test@test.test' })

      const { appelOffreId, periodeId, familleId, numeroCRE } = fakeProject

      await handleProjectImported({
        eventBus: eventBus as EventBus,
        getUserByEmail,
        isPeriodeLegacy,
      })(
        new ProjectImported({
          payload: {
            projectId,
            appelOffreId,
            periodeId,
            familleId,
            numeroCRE,
            potentielIdentifier: '',
            importId: '',
            data: fakeProject,
          },
        })
      )

      expect(getUserByEmail).toHaveBeenCalledWith('test@test.test')

      expect(eventBus.publish).toHaveBeenCalledTimes(1)
      const targetEvent = eventBus.publish.mock.calls[0][0]

      expect(targetEvent).toBeInstanceOf(UserRightsToProjectGranted)
      expect(targetEvent.payload).toMatchObject({ projectId, userId })
    })
  })

  describe('when receiving a ProjectReimported event with a changed email', () => {
    it('should gives rights to the project to the user with the same email', async () => {
      const projectId = new UniqueEntityID().toString()
      const userId = new UniqueEntityID().toString()
      const user = { ...makeFakeUser(), id: userId } as User
      const getUserByEmail = jest.fn((email: string) =>
        okAsync<User | null, InfraNotAvailableError>(user)
      )
      const eventBus = makeFakeEventBus()
      const isPeriodeLegacy = jest.fn(() => Promise.resolve(false))

      await handleProjectImported({
        eventBus: eventBus as EventBus,
        getUserByEmail,
        isPeriodeLegacy,
      })(
        new ProjectReimported({
          payload: {
            projectId,
            appelOffreId: '',
            periodeId: '',
            importId: '',
            data: { email: 'test@test.test' },
          },
        })
      )

      expect(getUserByEmail).toHaveBeenCalledWith('test@test.test')

      expect(eventBus.publish).toHaveBeenCalledTimes(1)
      const targetEvent = eventBus.publish.mock.calls[0][0]

      expect(targetEvent).toBeInstanceOf(UserRightsToProjectGranted)
      expect(targetEvent.payload).toMatchObject({ projectId, userId })
    })
  })

  describe('when the project is legacy', () => {
    const isPeriodeLegacy = jest.fn(() => Promise.resolve(true))
    it('should not give the rights to the project to the user', async () => {
      const projectId = new UniqueEntityID().toString()
      const userId = new UniqueEntityID().toString()
      const user = { ...makeFakeUser(), id: userId } as User
      const getUserByEmail = jest.fn((email: string) =>
        okAsync<User | null, InfraNotAvailableError>(user)
      )
      const eventBus = makeFakeEventBus()
      const fakeProject = makeFakeProject({ id: projectId, email: 'test@test.test' })

      const { appelOffreId, periodeId, familleId, numeroCRE } = fakeProject

      await handleProjectImported({
        eventBus: eventBus as EventBus,
        getUserByEmail,
        isPeriodeLegacy,
      })(
        new ProjectImported({
          payload: {
            projectId,
            appelOffreId,
            periodeId,
            familleId,
            numeroCRE,
            potentielIdentifier: '',
            importId: '',
            data: fakeProject,
          },
        })
      )

      expect(eventBus.publish).not.toHaveBeenCalled()
    })
  })
})
