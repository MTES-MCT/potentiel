import { DomainEvent, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { UserRightsToProjectRevoked } from '../events'
import { makeRevokeRightsToProject } from './revokeRightsToProject'

describe('revokeRightsToProject use-case', () => {
  it('should emit UserRightsRevoked event', async () => {
    const shouldUserAccessProject = jest.fn(async ({ user, projectId }) => true)
    const eventBus = {
      publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
      subscribe: jest.fn(),
    }

    const fakeAdminUser = makeUser(makeFakeUser()).unwrap()
    const rightsHolderId = new UniqueEntityID().toString()
    const projectId = new UniqueEntityID().toString()

    const revokeRightsToProject = makeRevokeRightsToProject({
      shouldUserAccessProject,
      eventBus,
    })

    const res = await revokeRightsToProject({
      revokedBy: fakeAdminUser,
      userId: rightsHolderId,
      projectId,
    })

    expect(res.isOk()).toBe(true)

    expect(shouldUserAccessProject).toHaveBeenCalledWith({ user: fakeAdminUser, projectId })

    expect(eventBus.publish).toHaveBeenCalledTimes(1)
    expect(eventBus.publish.mock.calls[0][0]).toBeInstanceOf(UserRightsToProjectRevoked)
    expect(eventBus.publish.mock.calls[0][0].payload).toEqual(
      expect.objectContaining({
        projectId,
        revokedBy: fakeAdminUser.id,
        userId: rightsHolderId,
      })
    )
  })

  describe('when user doesn‘t have rights to this project', () => {
    const shouldUserAccessProject = jest.fn(async ({ user, projectId }) => false)
    const eventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    }

    const fakeAdminUser = makeUser(makeFakeUser()).unwrap()
    const rightsHolderId = new UniqueEntityID().toString()
    const projectId = new UniqueEntityID().toString()

    const revokeRightsToProject = makeRevokeRightsToProject({
      shouldUserAccessProject,
      eventBus,
    })

    it('should return an UnauthorizedError', async () => {
      const res = await revokeRightsToProject({
        revokedBy: fakeAdminUser,
        userId: rightsHolderId,
        projectId,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)

      expect(eventBus.publish).not.toHaveBeenCalled()
    })
  })
})
