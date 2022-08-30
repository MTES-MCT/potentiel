import { logger } from '@core/utils'
import { ConfirmationAbandonDemandée } from '@modules/demandeModification'
import { NotifierPorteurChangementStatutDemande } from '../..'
import { GetModificationRequestInfoForStatusNotification } from '@modules/modificationRequest/queries'

type OnConfirmationAbandonDemandée = (evenement: ConfirmationAbandonDemandée) => Promise<void>

type MakeOnConfirmationAbandonDemandée = (dépendances: {
  getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification
  notifierPorteurChangementStatutDemande: NotifierPorteurChangementStatutDemande
}) => OnConfirmationAbandonDemandée

export const makeOnConfirmationAbandonDemandée: MakeOnConfirmationAbandonDemandée =
  ({ notifierPorteurChangementStatutDemande, getModificationRequestInfoForStatusNotification }) =>
  async ({ payload }: ConfirmationAbandonDemandée) => {
    const { demandeAbandonId } = payload

    await getModificationRequestInfoForStatusNotification(demandeAbandonId).match(
      async ({ porteursProjet, nomProjet, type }) => {
        if (!porteursProjet || !porteursProjet.length) {
          // no registered user for this projet, no one to warn
          return
        }

        await Promise.all(
          porteursProjet.map(({ email, fullName, id }) =>
            notifierPorteurChangementStatutDemande({
              email,
              fullName,
              porteurId: id,
              typeDemande: type,
              nomProjet,
              modificationRequestId: demandeAbandonId,
              status: 'en attente de confirmation',
              hasDocument: true,
            })
          )
        )
      },
      (e: Error) => {
        logger.error(e)
      }
    )
  }
