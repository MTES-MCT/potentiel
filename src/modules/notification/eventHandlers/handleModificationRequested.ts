import { NotificationService } from '..'
import { logger } from '../../../core/utils'
import { ProjectRepo, UserRepo } from '../../../dataAccess'
import routes from '../../../routes'
import { ModificationRequested } from '../../modificationRequest'
import { GetInfoForModificationRequested } from '../queries'

export const handleModificationRequested = (deps: {
  sendNotification: NotificationService['sendNotification']
  getInfoForModificationRequested: GetInfoForModificationRequested
  findUsersForDreal: UserRepo['findUsersForDreal']
  findProjectById: ProjectRepo['findById']
}) => async (event: ModificationRequested) => {
  const { modificationRequestId, projectId, type, requestedBy, authority } = event.payload

  await deps.getInfoForModificationRequested({ projectId, userId: requestedBy }).match(
    async ({ nomProjet, porteurProjet: { fullName, email } }) => {
      await _sendPPUpdateNotification({
        email,
        fullName,
        nomProjet,
      })
    },
    (e: Error) => {
      logger.error(e)
    }
  )

  const project = await deps.findProjectById(projectId)

  if (project && authority === 'dreal') {
    // Send dreal email for each dreal of each region
    const regions = project.regionProjet.split(' / ')
    await Promise.all(
      regions.map(async (region) => {
        const drealUsers = await deps.findUsersForDreal(region)

        await Promise.all(
          drealUsers.map((drealUser) =>
            deps.sendNotification({
              type: 'admin-modification-requested',
              message: {
                email: drealUser.email,
                name: drealUser.fullName,
                subject: `Potentiel - Nouvelle demande de type ${type} dans votre département ${project.departementProjet}`,
              },
              context: {
                modificationRequestId,
                projectId: project.id,
                dreal: region,
                userId: drealUser.id,
              },
              variables: {
                nom_projet: project.nomProjet,
                departement_projet: project.departementProjet,
                type_demande: type,
                modification_request_url: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
              },
            })
          )
        )
      })
    )
  }

  function _sendPPUpdateNotification(args: { email: string; fullName: string; nomProjet: string }) {
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
