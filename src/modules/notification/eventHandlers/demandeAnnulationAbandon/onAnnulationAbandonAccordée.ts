import { logger } from '@core/utils'
import { AnnulationAbandonAccordée } from '@modules/demandeModification'
import { NotifierPorteurChangementStatutDemande } from '../..'
import { GetModificationRequestInfoForStatusNotification } from '@modules/modificationRequest/queries'

type Commande = AnnulationAbandonAccordée

type Dépendances = {
  getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification
  notifierPorteurChangementStatutDemande: NotifierPorteurChangementStatutDemande
}

export const makeOnAnnulationAbandonAccordée =
  ({
    notifierPorteurChangementStatutDemande,
    getModificationRequestInfoForStatusNotification,
  }: Dépendances) =>
  async ({ payload }: Commande) => {
    const { demandeId } = payload

    await getModificationRequestInfoForStatusNotification(demandeId).match(
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
              modificationRequestId: demandeId,
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
