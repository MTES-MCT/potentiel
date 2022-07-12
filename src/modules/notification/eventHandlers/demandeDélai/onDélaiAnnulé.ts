import { logger, okAsync, ResultAsync, wrapInfra } from '@core/utils'
import { UserRepo } from '@dataAccess'
import { DélaiAnnulé } from '@modules/demandeModification'
import routes from '@routes'
import { NotificationService } from '../..'
import {
  GetModificationRequestInfoForStatusNotification,
  GetModificationRequestRecipient,
} from '../../../modificationRequest'
import { InfraNotAvailableError } from '../../../shared'

export const makeOnDélaiAnnulé =
  (deps: {
    sendNotification: NotificationService['sendNotification']
    findUsersForDreal: UserRepo['findUsersForDreal']
    getModificationRequestRecipient: GetModificationRequestRecipient
    getModificationRequestInfo: GetModificationRequestInfoForStatusNotification
    dgecEmail: string
  }) =>
  async (event: DélaiAnnulé) => {
    const {
      sendNotification,
      findUsersForDreal,
      getModificationRequestInfo,
      getModificationRequestRecipient,
      dgecEmail,
    } = deps

    const { demandeDélaiId } = event.payload

    const res = await getModificationRequestInfo(demandeDélaiId)
      .andThen((modificationRequest) => {
        return getModificationRequestRecipient(demandeDélaiId).map((recipient) => ({
          recipient,
          modificationRequest,
        }))
      })
      .andThen(({ recipient, modificationRequest }): ResultAsync<null, InfraNotAvailableError> => {
        const { nomProjet, departementProjet, regionProjet, type } = modificationRequest

        function _sendNotificationToAdmin(email, name) {
          return sendNotification({
            type: 'modification-request-cancelled',
            message: {
              email,
              name,
              subject: `Annulation d'une demande de type ${type} dans le département ${departementProjet}`,
            },
            context: {
              modificationRequestId: demandeDélaiId,
            },
            variables: {
              nom_projet: nomProjet,
              type_demande: type,
              departement_projet: departementProjet,
              modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeDélaiId),
            },
          })
        }

        if (recipient === 'dgec') {
          return wrapInfra(_sendNotificationToAdmin(dgecEmail, 'DGEC'))
        }

        if (recipient === 'dreal') {
          const regions = regionProjet.split(' / ')
          return wrapInfra(
            Promise.all(
              regions.map(async (region) => {
                // Notifiy existing dreal users
                const drealUsers = await findUsersForDreal(region)
                await Promise.all(
                  drealUsers.map((drealUser) =>
                    _sendNotificationToAdmin(drealUser.email, drealUser.fullName)
                  )
                )
              })
            )
          ).map(() => null)
        }

        return okAsync(null)
      })

    if (res.isErr()) {
      logger.error(res.error)
    }
  }
