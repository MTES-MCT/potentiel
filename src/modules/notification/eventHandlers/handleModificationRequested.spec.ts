import { okAsync } from 'neverthrow'
import { NotificationArgs } from '..'
import { UniqueEntityID } from '../../../core/domain'
import { makeUser } from '../../../entities'
import { UnwrapForTest } from '../../../types'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { ModificationRequested } from '../../modificationRequest'
import { GetInfoForModificationRequested } from '../queries'
import { handleModificationRequested } from './handleModificationRequested'

const modificationRequestId = new UniqueEntityID().toString()
const userId = new UniqueEntityID().toString()
const projectId = new UniqueEntityID().toString()

describe('notification.handleModificationRequested', () => {
  const sendNotification = jest.fn(async (args: NotificationArgs) => null)
  const getInfoForModificationRequested = jest.fn((args: { projectId; userId }) =>
    okAsync({
      porteurProjet: { email: 'email@test.test', fullName: 'john doe' },
      nomProjet: 'nomProjet',
    })
  ) as GetInfoForModificationRequested

  it('should set send a status-update email to the PP that submitted the request', async () => {
    sendNotification.mockClear()

    await handleModificationRequested({
      sendNotification,
      getInfoForModificationRequested,
    })(
      new ModificationRequested({
        payload: {
          type: 'recours',
          modificationRequestId,
          projectId,
          requestedBy: userId,
        },
      })
    )

    expect(getInfoForModificationRequested).toHaveBeenCalledWith({ projectId, userId })

    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notifications = sendNotification.mock.calls.map((call) => call[0])
    expect(
      notifications.every(
        (notification) =>
          notification.type === 'modification-request-status-update' &&
          notification.message.email === 'email@test.test' &&
          notification.message.name === 'john doe' &&
          notification.variables.status === 'envoyée' &&
          notification.variables.nom_projet === 'nomProjet' &&
          notification.variables.type_demande === 'recours' &&
          notification.variables.document_absent === ''
      )
    ).toBe(true)
  })
})
