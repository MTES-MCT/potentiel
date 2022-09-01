import { logger } from '@core/utils'
import { RejetChangementDePuissanceAnnulé } from '@modules/demandeModification'
import { GetModificationRequestInfoForStatusNotification } from '@modules/modificationRequest/queries'
import { NotifierPorteurChangementStatutDemande } from '../../'
type OnRejetChangementDePuissanceAnnulé = (
  evenement: RejetChangementDePuissanceAnnulé
) => Promise<void>

type MakeOnRejetChangementDePuissanceRecoursAnnulé = (dépendances: {
  getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification
  notifierPorteurChangementStatutDemande: NotifierPorteurChangementStatutDemande
}) => OnRejetChangementDePuissanceAnnulé

export const makeOnRejetChangementDePuissanceAnnulé: MakeOnRejetChangementDePuissanceRecoursAnnulé =

    ({ getModificationRequestInfoForStatusNotification, notifierPorteurChangementStatutDemande }) =>
    async ({ payload: { demandeChangementDePuissanceId } }: RejetChangementDePuissanceAnnulé) => {
      await getModificationRequestInfoForStatusNotification(demandeChangementDePuissanceId).match(
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
                modificationRequestId: demandeChangementDePuissanceId,
                status: 'repassée en statut "envoyée"',
                hasDocument: false,
              })
            )
          )
        },
        (e: Error) => {
          logger.error(e)
        }
      )
    }
