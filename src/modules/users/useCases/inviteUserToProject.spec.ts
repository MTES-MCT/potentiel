import { DomainEvent, UniqueEntityID } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { User } from '../../../entities'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { InfraNotAvailableError } from '../../shared'
import { makeInviteUserToProject } from './inviteUserToProject'
import { UserInvitedToProject } from '../../authZ'

describe('inviteUserToProject use-case', () => {
  const fakeUser: User = makeFakeUser()
  const fakeEmail = 'test@test.test'
  const fakeProjectId = new UniqueEntityID().toString()

  describe('when inviting user has rights on the projects', () => {
    const shouldUserAccessProject = jest.fn(async (args: { user: User; projectId: string }) => true)

    describe('when invited email is not an existing user', () => {
      const newUserId = new UniqueEntityID().toString()
      const getUserByEmail = jest.fn((email: string) =>
        okAsync<User | null, InfraNotAvailableError>(null)
      )
      const createUser = jest.fn((args: { role: User['role']; email: string }) =>
        okAsync<string, InfraNotAvailableError>(newUserId)
      )
      const eventBus = {
        publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
        subscribe: jest.fn(),
      }

      const inviteUserToProject = makeInviteUserToProject({
        getUserByEmail,
        shouldUserAccessProject,
        createUser,
        eventBus,
      })

      beforeAll(async () => {
        const res = await inviteUserToProject({
          email: fakeEmail,
          invitedBy: fakeUser,
          projectIds: [fakeProjectId],
        })
        expect(res.isOk()).toBe(true)
      })

      it('should create new user for this email', () => {
        expect(createUser).toHaveBeenCalledWith({
          role: 'porteur-projet',
          email: fakeEmail,
        })
      })

      it('emit UserInvitedToProject', () => {
        expect(eventBus.publish).toHaveBeenCalledTimes(1)
        const event = eventBus.publish.mock.calls[0][0]
        expect(event).toBeDefined()
        expect(event).toBeInstanceOf(UserInvitedToProject)
        expect(event.payload).toMatchObject({
          userId: newUserId,
          projectIds: [fakeProjectId],
          invitedBy: fakeUser.id,
        })
      })
    })

    describe('when invited email is an existing user', () => {
      const userWithEmail: User = makeFakeUser({ id: new UniqueEntityID().toString() })
      const getUserByEmail = jest.fn((email: string) =>
        okAsync<User | null, InfraNotAvailableError>(userWithEmail)
      )
      const createUser = jest.fn()
      const addProjectToUser = jest.fn((args: { userId: string; projectId: string }) =>
        okAsync<null, InfraNotAvailableError>(null)
      )

      const eventBus = {
        publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
        subscribe: jest.fn(),
      }

      const inviteUserToProject = makeInviteUserToProject({
        getUserByEmail,
        shouldUserAccessProject,
        createUser,
        eventBus,
      })

      beforeAll(async () => {
        const res = await inviteUserToProject({
          email: fakeEmail,
          invitedBy: fakeUser,
          projectIds: [fakeProjectId],
        })
        expect(res.isOk()).toBe(true)
      })

      it('should use the existing user for this email', () => {
        expect(getUserByEmail).toHaveBeenCalledWith(fakeEmail)
        expect(createUser).not.toHaveBeenCalled()
      })

      it('emit UserInvitedToProject', () => {
        expect(eventBus.publish).toHaveBeenCalledTimes(1)
        const event = eventBus.publish.mock.calls[0][0]
        expect(event).toBeDefined()
        expect(event).toBeInstanceOf(UserInvitedToProject)
        expect(event.payload).toMatchObject({
          userId: userWithEmail.id,
          projectIds: [fakeProjectId],
          invitedBy: fakeUser.id,
        })
      })
    })
  })

  describe('when inviting user has no rights on the projects', () => {
    const shouldUserAccessProject = jest.fn(
      async (args: { user: User; projectId: string }) => false
    )

    const getUserByEmail = jest.fn()
    const createUser = jest.fn()
    const eventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    }

    const inviteUserToProject = makeInviteUserToProject({
      getUserByEmail,
      shouldUserAccessProject,
      createUser,
      eventBus,
    })

    it('should return UnauthorizedError', async () => {
      const res = await inviteUserToProject({
        email: fakeEmail,
        invitedBy: fakeUser,
        projectIds: [fakeProjectId],
      })
      expect(res.isErr()).toBe(true)

      expect(createUser).not.toHaveBeenCalled()
      expect(eventBus.publish).not.toHaveBeenCalled()
    })
  })
})
