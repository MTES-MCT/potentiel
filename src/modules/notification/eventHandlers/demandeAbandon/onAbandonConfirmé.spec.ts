import { okAsync } from 'neverthrow'
import { NotificationArgs } from '../..'
import { UniqueEntityID } from '@core/domain'
import { makeUser } from '@entities'
import { UnwrapForTest } from '../../../../types'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { GetModificationRequestInfoForConfirmedNotification } from '../../../modificationRequest'
import { makeOnAbandonConfirmé } from './onAbandonConfirmé'
import { AbandonConfirmé, AbandonConfirméPayload } from '@modules/demandeModification'

const demandeAbandonId = new UniqueEntityID().toString()

describe(`Handler onAbandonConfirmé`, () => {
  describe(`Etant donné un événement AbandonConfirmé`, () => {
    const chargeAffaire = UnwrapForTest(
      makeUser(makeFakeUser({ role: 'admin', email: 'admin@test.test', fullName: 'admin1' }))
    )

    const sendNotification = jest.fn(async (args: NotificationArgs) => null)
    const getModificationRequestInfoForConfirmedNotification = jest.fn((demandeAbandonId) =>
      okAsync({
        chargeAffaire: { email: 'admin@test.test', fullName: 'admin1', id: chargeAffaire.id },
        nomProjet: 'nomProjet',
        type: 'abandon',
      })
    ) as GetModificationRequestInfoForConfirmedNotification

    it(`Alors une notification devrait être envoyée au chargé d'affaire à l'origine de la demande de confirmation`, async () => {
      sendNotification.mockClear()

      await makeOnAbandonConfirmé({
        sendNotification,
        getModificationRequestInfoForConfirmedNotification,
      })(
        new AbandonConfirmé({
          payload: { demandeAbandonId, confirméPar: '' } as AbandonConfirméPayload,
        })
      )

      expect(getModificationRequestInfoForConfirmedNotification).toHaveBeenCalledWith(
        demandeAbandonId
      )

      expect(sendNotification).toHaveBeenCalledTimes(1)
      const notification = sendNotification.mock.calls[0][0]

      expect(notification.message.email).toEqual('admin@test.test')

      expect(
        notification.type === 'modification-request-confirmed' &&
          notification.variables.nom_projet === 'nomProjet' &&
          notification.variables.type_demande === 'abandon'
      ).toBe(true)
    })
  })
})
