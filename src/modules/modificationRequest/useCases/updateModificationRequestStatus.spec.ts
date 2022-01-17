import { logger } from '@core/utils'
import { makeUser } from '../../../entities'
import { UnwrapForTest } from '../../../types'
import { fakeRepo, makeFakeModificationRequest } from '../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { AggregateHasBeenUpdatedSinceError, UnauthorizedError } from '../../shared'
import { ModificationRequest } from '../ModificationRequest'
import { makeUpdateModificationRequestStatus } from './updateModificationRequestStatus'

describe('updateModificationRequestStatus use-case', () => {
  describe('when user is admin', () => {
    const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
    const fakeModificationRequest = {
      ...makeFakeModificationRequest(),
    }
    const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)

    const updateModificationRequestStatus = makeUpdateModificationRequestStatus({
      modificationRequestRepo,
    })

    beforeAll(async () => {
      const res = await updateModificationRequestStatus({
        modificationRequestId: fakeModificationRequest.id,
        versionDate: fakeModificationRequest.lastUpdatedOn,
        newStatus: 'acceptée',
        submittedBy: fakeUser,
      })

      if (res.isErr()) logger.error(res.error)
      expect(res.isOk()).toEqual(true)
    })

    it('should call updateStatus on modificationRequest', () => {
      expect(fakeModificationRequest.updateStatus).toHaveBeenCalledTimes(1)
      expect(fakeModificationRequest.updateStatus).toHaveBeenCalledWith({
        updatedBy: fakeUser,
        newStatus: 'acceptée',
      })
    })

    it('should save the modificationRequest', () => {
      expect(modificationRequestRepo.save).toHaveBeenCalled()
      expect(modificationRequestRepo.save.mock.calls[0][0]).toEqual(fakeModificationRequest)
    })
  })

  describe('when user is not admin', () => {
    const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

    const fakeModificationRequest = {
      ...makeFakeModificationRequest(),
    }
    const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)

    const updateModificationRequestStatus = makeUpdateModificationRequestStatus({
      modificationRequestRepo,
    })

    it('should return UnauthorizedError', async () => {
      const res = await updateModificationRequestStatus({
        modificationRequestId: fakeModificationRequest.id,
        versionDate: fakeModificationRequest.lastUpdatedOn,
        newStatus: 'acceptée',
        submittedBy: fakeUser,
      })

      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return

      expect(res.error).toBeInstanceOf(UnauthorizedError)
    })
  })

  describe('when versionDate is different than current versionDate', () => {
    const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
    const fakeModificationRequest = {
      ...makeFakeModificationRequest(),
    }
    const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)

    const updateModificationRequestStatus = makeUpdateModificationRequestStatus({
      modificationRequestRepo,
    })

    it('should return AggregateHasBeenUpdatedSinceError', async () => {
      const res = await updateModificationRequestStatus({
        modificationRequestId: fakeModificationRequest.id,
        versionDate: new Date(1),
        newStatus: 'acceptée',
        submittedBy: fakeUser,
      })

      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return
      expect(res.error).toBeInstanceOf(AggregateHasBeenUpdatedSinceError)
    })
  })
})
