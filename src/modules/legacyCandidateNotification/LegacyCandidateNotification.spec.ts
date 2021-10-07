import { makeLegacyCandidateNotificationId } from '.'
import { UniqueEntityID } from '../../core/domain'
import { UnwrapForTest } from '../../core/utils'
import { LegacyCandidateNotified } from './events'
import { makeLegacyCandidateNotification } from './LegacyCandidateNotification'

const email = 'test@test.test'
const importId = new UniqueEntityID().toString()

describe('LegayCandidateNotification', () => {
  describe('notify()', () => {
    describe('when the candidate has not been notified yet', () => {
      const legacyCandidateNotification = UnwrapForTest(
        makeLegacyCandidateNotification({
          id: new UniqueEntityID(makeLegacyCandidateNotificationId({ email, importId })),
        })
      )

      it('should trigger a LegacyCandidateNotified', () => {
        expect(legacyCandidateNotification.pendingEvents).toHaveLength(0)

        legacyCandidateNotification.notify()

        expect(legacyCandidateNotification.pendingEvents).toHaveLength(1)

        const event = legacyCandidateNotification.pendingEvents[0]
        expect(event).toBeInstanceOf(LegacyCandidateNotified)

        expect(event!.payload).toEqual({
          email,
          importId,
        })
      })
    })

    describe('when the candidate has already been notified', () => {
      const legacyCandidateNotification = UnwrapForTest(
        makeLegacyCandidateNotification({
          id: new UniqueEntityID(makeLegacyCandidateNotificationId({ email, importId })),
          events: [
            new LegacyCandidateNotified({
              payload: {
                importId,
                email,
              },
            }),
          ],
        })
      )

      it('should not trigger a LegacyCandidateNotified', () => {
        expect(legacyCandidateNotification.pendingEvents).toHaveLength(0)

        legacyCandidateNotification.notify()

        expect(legacyCandidateNotification.pendingEvents).toHaveLength(0)
      })
    })
  })
})
