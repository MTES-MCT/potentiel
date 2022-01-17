import { UniqueEntityID } from '@core/domain'
import { LegacyCandidateNotified } from '../../legacyCandidateNotification'
import { NotificationArgs } from '../Notification'
import { handleLegacyCandidateNotified } from './handleLegacyCandidateNotified'

const importId = new UniqueEntityID().toString()
const email = 'email@test.test'

describe('notification.handleLegacyCandidateNotified', () => {
  it('should send a notification email to the PP', async () => {
    const sendNotification = jest.fn(async (args: NotificationArgs) => null)

    await handleLegacyCandidateNotified({
      sendNotification,
    })(
      new LegacyCandidateNotified({
        payload: {
          importId,
          email,
        },
      })
    )

    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0][0]
    expect(notification).toMatchObject({
      type: 'legacy-candidate-notification',
      message: {
        email,
      },
      context: {
        importId,
      },
    })
  })
})
