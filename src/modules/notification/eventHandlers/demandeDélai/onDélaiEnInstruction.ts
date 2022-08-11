import { logger } from '@core/utils'
import { DélaiEnInstruction } from '@modules/demandeModification'
import routes from '@routes'
import { NotificationService } from '../..'
import { GetModificationRequestInfoForStatusNotification } from '../../../modificationRequest/queries/GetModificationRequestInfoForStatusNotification'

type OnDélaiEnInstruction = (evenement: DélaiEnInstruction) => Promise<void>

type MakeOnDélaiEnInstruction = (dépendances: {
  sendNotification: NotificationService['sendNotification']
  getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification
}) => OnDélaiEnInstruction

export const makeOnDélaiEnInstruction: MakeOnDélaiEnInstruction =
  ({ sendNotification, getModificationRequestInfoForStatusNotification }) =>
  async ({ payload }: DélaiEnInstruction) => {
    const { demandeDélaiId } = payload

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
              demandeDélaiId,
              status: 'en instruction',
              hasDocument: true,
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
      demandeDélaiId: string
      porteurId: string
      status: string
      hasDocument: boolean
    }) {
      const {
        email,
        fullName,
        typeDemande,
        nomProjet,
        demandeDélaiId,
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
          modificationRequestId: demandeDélaiId,
          userId: porteurId,
        },
        variables: {
          nom_projet: nomProjet,
          type_demande: typeDemande,
          status,
          modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeDélaiId),
          document_absent: hasDocument ? undefined : '', // injecting an empty string will prevent the default "with document" message to be injected in the email body
        },
      })
    }
  }
