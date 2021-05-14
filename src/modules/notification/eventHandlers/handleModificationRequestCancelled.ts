import { NotificationService } from '..'
import { logger, okAsync, ResultAsync, wrapInfra } from '../../../core/utils'
import { UserRepo } from '../../../dataAccess'
import routes from '../../../routes'
import {
  GetModificationRequestInfoForStatusNotification,
  GetModificationRequestRecipient,
  ModificationRequestCancelled,
} from '../../modificationRequest'
import { InfraNotAvailableError } from '../../shared'

export const handleModificationRequestCancelled = (deps: {
  sendNotification: NotificationService['sendNotification']
  findUsersForDreal: UserRepo['findUsersForDreal']
  getModificationRequestRecipient: GetModificationRequestRecipient
  getModificationRequestInfo: GetModificationRequestInfoForStatusNotification
  dgecEmail: string
}) => async (event: ModificationRequestCancelled) => {
  const {
    sendNotification,
    findUsersForDreal,
    getModificationRequestInfo,
    getModificationRequestRecipient,
    dgecEmail,
  } = deps

  const { modificationRequestId } = event.payload

  const res = await getModificationRequestInfo(modificationRequestId)
    .andThen((modificationRequest) => {
      return getModificationRequestRecipient(modificationRequestId).map((recipient) => ({
        recipient,
        modificationRequest,
      }))
    })
    .andThen(
      ({ recipient, modificationRequest }): ResultAsync<null, InfraNotAvailableError> => {
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
              modificationRequestId,
            },
            variables: {
              nom_projet: nomProjet,
              type_demande: type,
              departement_projet: departementProjet,
              modification_request_url: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
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
      }
    )

  if (res.isErr()) {
    logger.error(res.error)
  }
}
