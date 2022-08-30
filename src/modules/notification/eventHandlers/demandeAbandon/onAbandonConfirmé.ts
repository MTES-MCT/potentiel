import { NotificationService } from '../..'
import { logger } from '@core/utils'
import routes from '@routes'
import { GetModificationRequestInfoForConfirmedNotification } from '../../../modificationRequest/queries'
import { AbandonConfirmé } from '@modules/demandeModification'

export const makeOnAbandonConfirmé =
  (deps: {
    sendNotification: NotificationService['sendNotification']
    getModificationRequestInfoForConfirmedNotification: GetModificationRequestInfoForConfirmedNotification
  }) =>
  async (event: AbandonConfirmé) => {
    const { demandeAbandonId } = event.payload

    await deps.getModificationRequestInfoForConfirmedNotification(demandeAbandonId).match(
      async ({ chargeAffaire, nomProjet, type }) => {
        if (!chargeAffaire) {
          // no registered user for this projet, no one to warn
          return
        }

        const { email, fullName, id } = chargeAffaire

        return deps.sendNotification({
          type: 'modification-request-confirmed',
          message: {
            email,
            name: fullName,
            subject: `Demande d'abandon confirmée pour le projet ${nomProjet.toLowerCase()}`,
          },
          context: {
            modificationRequestId: demandeAbandonId,
            userId: id,
          },
          variables: {
            nom_projet: nomProjet,
            type_demande: type,
            modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeAbandonId),
          },
        })
      },
      (e: Error) => {
        logger.error(e)
      }
    )
  }
