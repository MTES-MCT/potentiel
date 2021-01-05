import { NotificationService } from '..'
import routes from '../../../routes'
import {
  ModificationRequestAccepted,
  ModificationRequestInstructionStarted,
} from '../../modificationRequest'
import { GetModificationRequestInfoForStatusNotification } from '../../modificationRequest/queries/GetModificationRequestInfoForStatusNotification'

export const handleModificationRequestStatusChanged = (deps: {
  sendNotification: NotificationService['sendNotification']
  getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification
}) => async (event: ModificationRequestAccepted | ModificationRequestInstructionStarted) => {
  const modificationRequestId = event.payload.modificationRequestId
  let status: string = 'mise à jour' // default
  let hasDocument: boolean = false
  if (event instanceof ModificationRequestAccepted) {
    status = 'acceptée'
    hasDocument = true
  } else if (event instanceof ModificationRequestInstructionStarted) {
    status = 'en instruction'
    hasDocument = false
  }

  await deps.getModificationRequestInfoForStatusNotification(modificationRequestId).match(
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
            modificationRequestId,
            status,
            hasDocument,
          })
        )
      )
    },
    (e: any) => {
      console.error(
        'handleModificationRequestStatusChanged caught an event but could not send the notifications',
        e
      )
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
    return deps.sendNotification({
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
}
