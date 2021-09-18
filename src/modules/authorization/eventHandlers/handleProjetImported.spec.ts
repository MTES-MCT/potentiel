import { ProjectImported, ProjectReimported } from '../../project'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { handleProjectImported } from './handleProjetImported'
import { UniqueEntityID } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { makeFakeEventBus } from '../../../__tests__/fixtures/aggregates/fakeEventBus'
import { EventBus } from '../../eventStore'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { User } from '../../../entities'
import { UserRightsToProjectGranted } from '..'
import { InfraNotAvailableError } from '../../shared'

describe('authorization handleProjectImported', () => {
  describe('when receiving a ProjectImported event', () => {
    it('should trigger UserRightsToProjectGranted', async () => {
      const projectId = new UniqueEntityID().toString()
      const userId = new UniqueEntityID().toString()
      const user = { ...makeFakeUser(), id: userId } as User
      const getUserByEmail = jest.fn((email: string) =>
        okAsync<User | null, InfraNotAvailableError>(user)
      )
      const eventBus = makeFakeEventBus()
      const fakeProject = makeFakeProject({ id: projectId, email: 'test@test.test' })

      const { appelOffreId, periodeId, familleId, numeroCRE } = fakeProject

      await handleProjectImported({ eventBus: eventBus as EventBus, getUserByEmail })(
        new ProjectImported({
          payload: {
            projectId,
            appelOffreId,
            periodeId,
            familleId,
            numeroCRE,
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
      const addProjectToUserWithEmail = jest.fn(async (projectId: string, email: string) => null)
      const projectId = new UniqueEntityID().toString()
      const userId = new UniqueEntityID().toString()
      const user = { ...makeFakeUser(), id: userId } as User
      const getUserByEmail = jest.fn((email: string) =>
        okAsync<User | null, InfraNotAvailableError>(user)
      )
      const eventBus = makeFakeEventBus()
      const fakeProject = makeFakeProject({ id: projectId, email: 'test@test.test' })

      await handleProjectImported({ eventBus: eventBus as EventBus, getUserByEmail })(
        new ProjectReimported({
          payload: {
            projectId,
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
})
