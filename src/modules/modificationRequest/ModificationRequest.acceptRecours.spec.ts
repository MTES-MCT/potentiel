import { UniqueEntityID } from '../../core/domain'
import { makeUser } from '../../entities'
import makeFakeUser from '../../__tests__/fixtures/user'
import { ModificationRequested, RecoursAccepted } from './events'
import { StatusPreventsAcceptingError } from './errors'
import { makeModificationRequest } from './ModificationRequest'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import { UnwrapForTest } from '../../core/utils'

describe('Modification.acceptRecours()', () => {
  const modificationRequestId = new UniqueEntityID()
  const projectId = new UniqueEntityID()
  const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()))

  describe('when demande status is envoyée or en instruction', () => {
    const fakeModificationRequest = UnwrapForTest(
      makeModificationRequest({
        modificationRequestId,
        history: [
          new ModificationRequested({
            payload: {
              modificationRequestId: modificationRequestId.toString(),
              projectId: projectId.toString(),
              type: 'recours',
              requestedBy: fakeUser.id,
            },
          }),
        ],
      })
    )

    beforeAll(() => {
      expect(fakeModificationRequest.status).toEqual('envoyée')

      const res = fakeModificationRequest.acceptRecours(fakeUser)
      expect(res.isOk()).toBe(true)
    })

    it('should emit RecoursAccepted', () => {
      expect(fakeModificationRequest.pendingEvents).not.toHaveLength(0)

      const targetEvent = fakeModificationRequest.pendingEvents.find(
        (item) => item.type === RecoursAccepted.type
      ) as RecoursAccepted | undefined
      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.modificationRequestId).toEqual(modificationRequestId.toString())
    })

    it('should set status to acceptée', () => {
      expect(fakeModificationRequest.status).toEqual('acceptée')
    })
  })

  describe('when demande status is acceptée', () => {
    const fakeModificationRequest = UnwrapForTest(
      makeModificationRequest({
        modificationRequestId,
        history: [
          new ModificationRequested({
            payload: {
              modificationRequestId: modificationRequestId.toString(),
              projectId: projectId.toString(),
              type: 'recours',
              requestedBy: fakeUser.id,
            },
          }),
          new RecoursAccepted({
            payload: {
              modificationRequestId: modificationRequestId.toString(),
              acceptedBy: fakeUser.id,
            },
          }),
        ],
      })
    )

    it('should return StatusPreventsAcceptingError', () => {
      expect(fakeModificationRequest.status).toEqual('acceptée')

      const res = fakeModificationRequest.acceptRecours(fakeUser)
      expect(res.isErr()).toBe(true)
      if (res.isOk()) return

      expect(res.error).toBeInstanceOf(StatusPreventsAcceptingError)
    })
  })
})
