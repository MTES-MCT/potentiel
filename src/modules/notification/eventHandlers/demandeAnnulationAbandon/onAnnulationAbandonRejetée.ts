import { logger } from '@core/utils'
import { AnnulationAbandonRejetée } from '@modules/demandeModification'
import { NotifierPorteurChangementStatutDemande } from '../..'
import { GetModificationRequestInfoForStatusNotification } from '@modules/modificationRequest/queries'

type Argument = AnnulationAbandonRejetée

type Dépendances = {
  getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification
  notifierPorteurChangementStatutDemande: NotifierPorteurChangementStatutDemande
}

export const makeOnAnnulationAbandonRejetée =
  ({
    notifierPorteurChangementStatutDemande,
    getModificationRequestInfoForStatusNotification,
  }: Dépendances) =>
  async ({ payload }: Argument) => {
    const { demandeId } = payload

    console.log('handler')
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
