import { logger } from '@core/utils'
import { AbandonDemandé } from '@modules/demandeModification'
import { GetModificationRequestInfoForStatusNotification } from '@modules/modificationRequest/queries'

import { NotifierPorteurChangementStatutDemande } from '../..'

type OnAbandonDemandé = (evenement: AbandonDemandé) => Promise<void>

type MakeOnAbandonDemandé = (dépendances: {
  getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification
  notifierPorteurChangementStatutDemande: NotifierPorteurChangementStatutDemande
}) => OnAbandonDemandé

export const makeOnAbandonDemandé: MakeOnAbandonDemandé =
  ({ notifierPorteurChangementStatutDemande, getModificationRequestInfoForStatusNotification }) =>
  async ({ payload }: AbandonDemandé) => {
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
              status: 'envoyée',
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
