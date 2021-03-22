import { DomainEvent, UniqueEntityID } from '../../../core/domain'
import { errAsync, okAsync } from '../../../core/utils'
import { makeUser } from '../../../entities'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { InvitationToProjectCancelled } from '../events'
import { makeCancelInvitationToProject } from './cancelInvitationToProject'

describe('cancelInvitationToProject use-case', () => {
  it('should emit InvitationToProjectCancelled event', async () => {
    const fakeAdminUser = makeUser(makeFakeUser()).unwrap()
    const projectId = new UniqueEntityID().toString()
    const projectAdmissionKeyId = new UniqueEntityID().toString()

    const shouldUserAccessProject = jest.fn(async ({ user, projectId }) => true)
    const getProjectIdForAdmissionKey = jest.fn((projectAdmissionKeyId: string) =>
      okAsync<string, InfraNotAvailableError | EntityNotFoundError>(projectId)
    )
    const eventBus = {
      publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
      subscribe: jest.fn(),
    }

    const cancelInvitationToProject = makeCancelInvitationToProject({
      shouldUserAccessProject,
      getProjectIdForAdmissionKey,
      eventBus,
    })

    const res = await cancelInvitationToProject({
      cancelledBy: fakeAdminUser,
      projectAdmissionKeyId,
    })

    expect(res.isOk()).toBe(true)

    expect(getProjectIdForAdmissionKey).toHaveBeenCalledWith(projectAdmissionKeyId)
    expect(shouldUserAccessProject).toHaveBeenCalledWith({ user: fakeAdminUser, projectId })

    expect(eventBus.publish).toHaveBeenCalledTimes(1)
    expect(eventBus.publish.mock.calls[0][0]).toBeInstanceOf(InvitationToProjectCancelled)
    expect(eventBus.publish.mock.calls[0][0].payload).toEqual(
      expect.objectContaining({
        projectAdmissionKeyId,
        cancelledBy: fakeAdminUser.id,
      })
    )
  })

  describe('when user doesn‘t have rights to this project', () => {
    const projectId = new UniqueEntityID().toString()
    const projectAdmissionKeyId = new UniqueEntityID().toString()
    const fakeAdminUser = makeUser(makeFakeUser()).unwrap()

    const getProjectIdForAdmissionKey = jest.fn((projectAdmissionKeyId: string) =>
      okAsync<string, InfraNotAvailableError | EntityNotFoundError>(projectId)
    )
    const shouldUserAccessProject = jest.fn(async ({ user, projectId }) => false)
    const eventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    }

    const cancelInvitationToProject = makeCancelInvitationToProject({
      shouldUserAccessProject,
      getProjectIdForAdmissionKey,
      eventBus,
    })

    it('should return an UnauthorizedError', async () => {
      const res = await cancelInvitationToProject({
        cancelledBy: fakeAdminUser,
        projectAdmissionKeyId,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)

      expect(eventBus.publish).not.toHaveBeenCalled()
    })
  })

  describe('when project admission key is not found', () => {
    const projectAdmissionKeyId = new UniqueEntityID().toString()
    const fakeAdminUser = makeUser(makeFakeUser()).unwrap()

    const getProjectIdForAdmissionKey = jest.fn((projectAdmissionKeyId: string) =>
      errAsync<string, InfraNotAvailableError | EntityNotFoundError>(new EntityNotFoundError())
    )
    const shouldUserAccessProject = jest.fn()
    const eventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    }

    const cancelInvitationToProject = makeCancelInvitationToProject({
      shouldUserAccessProject,
      getProjectIdForAdmissionKey,
      eventBus,
    })

    it('should return an EntityNotFoundError', async () => {
      const res = await cancelInvitationToProject({
        cancelledBy: fakeAdminUser,
        projectAdmissionKeyId,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(EntityNotFoundError)

      expect(eventBus.publish).not.toHaveBeenCalled()
    })
  })
})
