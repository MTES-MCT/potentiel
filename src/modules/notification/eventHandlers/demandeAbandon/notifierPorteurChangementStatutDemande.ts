import routes from '@routes'
import { NotificationService } from '../../NotificationService'

export type NotifierPorteurChangementStatutDemande = (args: {
  email: string
  fullName: string
  typeDemande: string
  nomProjet: string
  modificationRequestId: string
  porteurId: string
  status: string
  hasDocument: boolean
}) => Promise<null>

export type MakeNotifierPorteurChangementStatutDemande = (dépendances: {
  sendNotification: NotificationService['sendNotification']
}) => NotifierPorteurChangementStatutDemande

export const makeNotifierPorteurChangementStatutDemande: MakeNotifierPorteurChangementStatutDemande =

    ({ sendNotification }) =>
    async ({
      email,
      fullName,
      typeDemande,
      nomProjet,
      modificationRequestId,
      porteurId,
      status,
      hasDocument,
    }) => {
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
