import { NotificationService } from '../..'
import { logger, ResultAsync, wrapInfra } from '@core/utils'
import routes from '@routes'
import { GetModificationRequestInfoForStatusNotification } from '../../../modificationRequest'
import { InfraNotAvailableError } from '../../../shared'
import { AbandonAnnulé } from '@modules/demandeModification'

export const makeOnAbandonAnnulé =
  (deps: {
    sendNotification: NotificationService['sendNotification']
    getModificationRequestInfo: GetModificationRequestInfoForStatusNotification
    dgecEmail: string
  }) =>
  async (event: AbandonAnnulé) => {
    const { sendNotification, getModificationRequestInfo, dgecEmail } = deps

    const { demandeAbandonId } = event.payload

    const res = await getModificationRequestInfo(demandeAbandonId).andThen(
      ({ nomProjet, departementProjet, type }): ResultAsync<null, InfraNotAvailableError> => {
        return wrapInfra(
          sendNotification({
            type: 'modification-request-cancelled',
            message: {
              email: dgecEmail,
              name: 'DGEC',
              subject: `Annulation d'une demande de type abandon dans le département ${departementProjet}`,
            },
            context: {
              modificationRequestId: demandeAbandonId,
            },
            variables: {
              nom_projet: nomProjet,
              type_demande: type,
              departement_projet: departementProjet,
              modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeAbandonId),
            },
          })
        )
      }
    )

    if (res.isErr()) {
      logger.error(res.error)
    }
  }
