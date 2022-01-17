import { okAsync } from 'neverthrow'
import { NotificationArgs } from '..'
import { UniqueEntityID } from '@core/domain'
import makeFakeUser from '../../../__tests__/fixtures/user'
import {
  GetModificationRequestInfoForStatusNotification,
  GetModificationRequestRecipient,
  ModificationRequestCancelled,
} from '../../modificationRequest'
import { handleModificationRequestCancelled } from './handleModificationRequestCancelled'

const modificationRequestId = new UniqueEntityID().toString()
const dgecEmail = 'dgec@test.test'

describe('notification.handleModificationRequestCancelled', () => {
  describe('when the modification request concerns the DGEC', () => {
    const getModificationRequestRecipient = jest.fn((() =>
      okAsync('dgec')) as GetModificationRequestRecipient)

    const getModificationRequestInfo = jest.fn((() =>
      okAsync({
        porteursProjet: [],
        departementProjet: 'departement',
        regionProjet: '',
        nomProjet: 'nomProjet',
        type: 'recours',
      })) as GetModificationRequestInfoForStatusNotification)

    const sendNotification = jest.fn(async (args: NotificationArgs) => null)

    const findUsersForDreal = jest.fn(async () => [])

    it('should send en email to the DGEC', async () => {
      await handleModificationRequestCancelled({
        sendNotification,
        findUsersForDreal,
        dgecEmail,
        getModificationRequestRecipient,
        getModificationRequestInfo,
      })(
        new ModificationRequestCancelled({
          payload: {
            modificationRequestId,
            cancelledBy: '',
          },
        })
      )

      expect(sendNotification).toHaveBeenCalledTimes(1)
      const notification = sendNotification.mock.calls[0][0]
      expect(notification).toMatchObject({
        type: 'modification-request-cancelled',
        message: {
          email: dgecEmail,
          name: 'DGEC',
        },
        context: {
          modificationRequestId,
        },
        variables: {
          nom_projet: 'nomProjet',
          type_demande: 'recours',
          departement_projet: 'departement',
        },
      })
    })
  })

  describe('when the modification request concerns the DREAL', () => {
    const getModificationRequestRecipient = jest.fn((() =>
      okAsync('dreal')) as GetModificationRequestRecipient)

    const getModificationRequestInfo = jest.fn((() =>
      okAsync({
        porteursProjet: [],
        departementProjet: 'departement',
        regionProjet: 'regionA / regionB',
        nomProjet: 'nomProjet',
        type: 'recours',
      })) as GetModificationRequestInfoForStatusNotification)

    const sendNotification = jest.fn(async (args: NotificationArgs) => null)

    const findUsersForDreal = jest.fn(async (region: string) =>
      region === 'regionA'
        ? [makeFakeUser({ email: 'drealA@test.test', fullName: 'drealA' })]
        : [makeFakeUser({ email: 'drealB@test.test', fullName: 'drealB' })]
    )

    it('should send en email to each DREAL user concerned', async () => {
      await handleModificationRequestCancelled({
        sendNotification,
        findUsersForDreal,
        dgecEmail,
        getModificationRequestRecipient,
        getModificationRequestInfo,
      })(
        new ModificationRequestCancelled({
          payload: {
            modificationRequestId,
            cancelledBy: '',
          },
        })
      )

      expect(sendNotification).toHaveBeenCalledTimes(2)
      const notifications = sendNotification.mock.calls.map((call) => call[0])
      expect(
        notifications.some(
          (notification) =>
            notification.type === 'modification-request-cancelled' &&
            notification.message.email === 'drealA@test.test' &&
            notification.message.name === 'drealA' &&
            notification.variables.departement_projet === 'departement' &&
            notification.variables.nom_projet === 'nomProjet' &&
            notification.variables.type_demande === 'recours'
        )
      ).toBe(true)
      expect(
        notifications.some(
          (notification) =>
            notification.type === 'modification-request-cancelled' &&
            notification.message.email === 'drealB@test.test' &&
            notification.message.name === 'drealB' &&
            notification.variables.departement_projet === 'departement' &&
            notification.variables.nom_projet === 'nomProjet' &&
            notification.variables.type_demande === 'recours'
        )
      ).toBe(true)
    })
  })
})
