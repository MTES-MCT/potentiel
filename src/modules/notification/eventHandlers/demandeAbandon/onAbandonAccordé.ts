import { logger } from '@core/utils'
import { AbandonAccordé } from '@modules/demandeModification'
import { NotifierPorteurChangementStatutDemande } from '../..'
import { GetModificationRequestInfoForStatusNotification } from '@modules/modificationRequest/queries'

type OnAbandonAccordé = (evenement: AbandonAccordé) => Promise<void>

type MakeOnAbandonAccordé = (dépendances: {
  getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification
  notifierPorteurChangementStatutDemande: NotifierPorteurChangementStatutDemande
}) => OnAbandonAccordé

export const makeOnAbandonAccordé: MakeOnAbandonAccordé =
  ({ notifierPorteurChangementStatutDemande, getModificationRequestInfoForStatusNotification }) =>
  async ({ payload }: AbandonAccordé) => {
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
              status: 'acceptée',
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
