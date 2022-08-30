import { logger } from '@core/utils'
import { AbandonRejeté } from '@modules/demandeModification'
import { NotifierPorteurChangementStatutDemande } from '../..'
import { GetModificationRequestInfoForStatusNotification } from '@modules/modificationRequest/queries'

type OnAbandonRejeté = (evenement: AbandonRejeté) => Promise<void>

type MakeOnAbandonRejeté = (dépendances: {
  getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification
  notifierPorteurChangementStatutDemande: NotifierPorteurChangementStatutDemande
}) => OnAbandonRejeté

export const makeOnAbandonRejeté: MakeOnAbandonRejeté =
  ({ notifierPorteurChangementStatutDemande, getModificationRequestInfoForStatusNotification }) =>
  async ({ payload }: AbandonRejeté) => {
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
              status: 'rejetée',
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
