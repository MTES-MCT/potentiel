import { UniqueEntityID } from '../../core/domain'
import { UnwrapForTest } from '../../core/utils'
import { makeUser } from '../../entities'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeUser from '../../__tests__/fixtures/user'
import { ModificationRequested, ModificationRequestStatusUpdated } from './events'
import { makeModificationRequest } from './ModificationRequest'

describe('Modification.updateStatus()', () => {
  const modificationRequestId = new UniqueEntityID()
  const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()))

  it('should emit ModificationRequestStatusUpdated', () => {
    const fakeModificationRequest = UnwrapForTest(
      makeModificationRequest({
        modificationRequestId,
        history: [
          new ModificationRequested({
            payload: {
              modificationRequestId: modificationRequestId.toString(),
              projectId: '',
              type: 'recours',
              requestedBy: fakeUser.id,
              authority: 'dgec',
            },
          }),
        ],
      })
    )

    expect(fakeModificationRequest.pendingEvents).toHaveLength(0)

    const res = fakeModificationRequest.updateStatus({ updatedBy: fakeUser, newStatus: 'acceptée' })

    expect(res.isOk()).toBe(true)

    expect(fakeModificationRequest.pendingEvents).toHaveLength(1)
    const targetEvent = fakeModificationRequest.pendingEvents.find(
      (item) => item.type === ModificationRequestStatusUpdated.type
    ) as ModificationRequestStatusUpdated | undefined
    expect(targetEvent).toBeDefined()
    if (!targetEvent) return

    expect(targetEvent.payload).toMatchObject({
      modificationRequestId: modificationRequestId.toString(),
      updatedBy: fakeUser.id,
      newStatus: 'acceptée',
    })
  })
})
