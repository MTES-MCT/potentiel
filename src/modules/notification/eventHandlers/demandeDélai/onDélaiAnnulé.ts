import { logger, okAsync, ResultAsync, wrapInfra } from '@core/utils'
import { UserRepo } from '@dataAccess'
import { DélaiAnnulé } from '@modules/demandeModification'
import { InfraNotAvailableError } from '@modules/shared'
import routes from '@routes'
import { NotificationService } from '../..'
import {
  GetModificationRequestInfoForStatusNotification,
  GetModificationRequestRecipient,
} from '../../../modificationRequest'

type OnDélaiAnnulé = (evenement: DélaiAnnulé) => Promise<void>

type MakeOnDélaiAnnulé = (dépendances: {
  sendNotification: NotificationService['sendNotification']
  getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification
  getModificationRequestRecipient: GetModificationRequestRecipient
  dgecEmail: string
  findUsersForDreal: UserRepo['findUsersForDreal']
}) => OnDélaiAnnulé

export const makeOnDélaiAnnulé: MakeOnDélaiAnnulé =
  ({
    sendNotification,
    getModificationRequestInfoForStatusNotification,
    getModificationRequestRecipient,
    dgecEmail,
    findUsersForDreal,
  }) =>
  async (event: DélaiAnnulé) => {
    const { demandeDélaiId } = event.payload

    await getModificationRequestInfoForStatusNotification(demandeDélaiId).match(
      async ({ porteursProjet, nomProjet, type }) => {
        if (!porteursProjet || !porteursProjet.length) {
          // no registered user for this projet, no one to warn
          return
        }

        await Promise.all(
          porteursProjet.map(({ email, fullName, id }) =>
            _sendUpdateNotification({
              email,
              fullName,
              porteurId: id,
              typeDemande: type,
              nomProjet,
              modificationRequestId: demandeDélaiId,
              status: 'annulée',
              hasDocument: false,
            })
          )
        )
      },
      (e: Error) => {
        logger.error(e)
      }
    )

    function _sendUpdateNotification(args: {
      email: string
      fullName: string
      typeDemande: string
      nomProjet: string
      modificationRequestId: string
      porteurId: string
      status: string
      hasDocument: boolean
    }) {
      const {
        email,
        fullName,
        typeDemande,
        nomProjet,
        modificationRequestId,
        porteurId,
        status,
        hasDocument,
      } = args
      return sendNotification({
        type: 'modification-request-status-update',
        message: {
          email,
          name: fullName,
          subject: `Votre demande de ${typeDemande} pour le projet ${nomProjet}`,
        },
        context: {
          modificationRequestId,
          userId: porteurId,
        },
        variables: {
          nom_projet: nomProjet,
          type_demande: typeDemande,
          status,
          modification_request_url: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
          document_absent: hasDocument ? undefined : '', // injecting an empty string will prevent the default "with document" message to be injected in the email body
        },
      })
    }

    const res = await getModificationRequestInfoForStatusNotification(demandeDélaiId)
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
