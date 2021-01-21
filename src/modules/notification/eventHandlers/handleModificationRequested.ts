import { NotificationService } from '..'
import routes from '../../../routes'
import { ModificationRequested } from '../../modificationRequest'
import { GetInfoForModificationRequested } from '../queries'

export const handleModificationRequested = (deps: {
  sendNotification: NotificationService['sendNotification']
  getInfoForModificationRequested: GetInfoForModificationRequested
}) => async (event: ModificationRequested) => {
  const { modificationRequestId, projectId, type, requestedBy } = event.payload

  await deps.getInfoForModificationRequested({ projectId, userId: requestedBy }).match(
    async ({ nomProjet, porteurProjet: { fullName, email } }) => {
      await _sendUpdateNotification({
        email,
        fullName,
        nomProjet,
      })
    },
    (e: any) => {
      console.error(e)
    }
  )

  function _sendUpdateNotification(args: { email: string; fullName: string; nomProjet: string }) {
    const { email, fullName, nomProjet } = args
    return deps.sendNotification({
      type: 'modification-request-status-update',
      message: {
        email,
        name: fullName,
        subject: `Votre demande de ${type} pour le projet ${nomProjet}`,
      },
      context: {
        modificationRequestId,
        userId: requestedBy,
      },
      variables: {
        nom_projet: nomProjet,
        type_demande: type,
        status: 'envoyée',
        modification_request_url: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
        document_absent: '', // injecting an empty string will prevent the default "with document" message to be injected in the email body
      },
    })
  }
}
