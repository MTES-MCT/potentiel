import { logger } from '@core/utils'
import { ProjectRepo } from '@dataAccess'
import { ProjectCompletionDueDateSet } from '@modules/project'
import routes from '@routes'
import { NotificationService } from '../NotificationService'

type OnProjectCompletionDueDateSet = (évènement: ProjectCompletionDueDateSet) => Promise<void>

type MakeOnProjectCompletionDueDateSet = (dépendances: {
  sendNotification: NotificationService['sendNotification']
  getProjectUsers: ProjectRepo['getUsers']
  getProjectById: ProjectRepo['findById']
}) => OnProjectCompletionDueDateSet

export const makeOnProjectCompletionDueDateSet: MakeOnProjectCompletionDueDateSet =
  ({ sendNotification, getProjectUsers, getProjectById }) =>
  async ({ payload: { projectId, reason } }) => {
    if (reason !== 'délaiCdc2022') {
      return
    }
    const destinatairesEmails = await getProjectUsers(projectId)
    if (!destinatairesEmails) return

    const projet = await getProjectById(projectId)
    if (!projet) {
      logger.error(
        `Notification handler onProjectCompletionDueDateSet pour délai CDC 2022: projet ${projectId} non trouvé.`
      )
      return
    }

    for (const { email, fullName, id } of destinatairesEmails) {
      await sendNotification({
        type: 'pp-delai-cdc-2022-appliqué',
        context: { projetId: projectId, utilisateurId: id },
        variables: { nom_projet: projet.nomProjet, projet_url: routes.PROJECT_DETAILS(projectId) },
        message: {
          email,
          name: fullName,
          subject: `Potentiel - Nouveau délai appliqué pour votre projet ${projet.nomProjet}`,
        },
      })
    }
  }
