import { logger } from '@core/utils'
import {
  fakeTransactionalRepo,
  makeFakeModificationRequest,
} from '../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../shared'
import { ModificationRequest } from '../ModificationRequest'
import { makeCancelModificationRequest } from './cancelModificationRequest'

describe('cancelModificationRequest use-case', () => {
  const fakeUser = makeFakeUser({ role: 'porteur-project' })

  describe('when user has rights to this project', () => {
    const shouldUserAccessProject = jest.fn(async () => true)

    const fakeModificationRequest = {
      ...makeFakeModificationRequest(),
    }
    const modificationRequestRepo = fakeTransactionalRepo(
      fakeModificationRequest as ModificationRequest
    )

    const cancelModificationRequest = makeCancelModificationRequest({
      modificationRequestRepo,
      shouldUserAccessProject,
    })

    beforeAll(async () => {
      const res = await cancelModificationRequest({
        modificationRequestId: fakeModificationRequest.id,
        cancelledBy: fakeUser,
      })

      if (res.isErr()) logger.error(res.error)
      expect(res.isOk()).toEqual(true)
    })

    it('should call cancel on modificationRequest', () => {
      expect(fakeModificationRequest.cancel).toHaveBeenCalledTimes(1)
      expect(fakeModificationRequest.cancel).toHaveBeenCalledWith(fakeUser)
    })
  })

  describe('when user does not have rights to this project', () => {
    const shouldUserAccessProject = jest.fn(async () => false)

    const fakeModificationRequest = {
      ...makeFakeModificationRequest(),
    }
    const modificationRequestRepo = fakeTransactionalRepo(
      fakeModificationRequest as ModificationRequest
    )

    const cancelModificationRequest = makeCancelModificationRequest({
      modificationRequestRepo,
      shouldUserAccessProject,
    })

    it('should return UnauthorizedError', async () => {
      const res = await cancelModificationRequest({
        modificationRequestId: fakeModificationRequest.id,
        cancelledBy: fakeUser,
      })

      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return

      expect(res.error).toBeInstanceOf(UnauthorizedError)
      expect(fakeModificationRequest.cancel).not.toHaveBeenCalled()
    })
  })
})
