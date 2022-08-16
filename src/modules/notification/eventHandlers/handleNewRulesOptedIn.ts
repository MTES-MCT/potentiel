import { NotificationService } from '..'
import { ProjectRepo, UserRepo } from '@dataAccess'
import { logger } from '@core/utils'
import { ProjectNewRulesOptedIn } from '../../project'

export const handleNewRulesOptedIn =
  (deps: {
    sendNotification: NotificationService['sendNotification']
    findProjectById: ProjectRepo['findById']
    findUserById: UserRepo['findById']
  }) =>
  async (event: ProjectNewRulesOptedIn) => {
    const { projectId, optedInBy } = event.payload

    const project = await deps.findProjectById(projectId)

    if (!project) {
      logger.error(new Error('handleNewRulesOptedIn failed because project is not found'))
      return
    }

    // Send user email
    ;(await deps.findUserById(optedInBy)).match({
      some: async ({ email, fullName }) => {
        const payload: any = {
          type: 'pp-new-rules-opted-in',
          message: {
            email: email,
            name: fullName,
            subject: `Potentiel - Nouveau mode d'instruction choisi pour les demandes liées à votre projet ${project.nomProjet}`,
          },
          context: {
            projectId: project.id,
            userId: optedInBy,
          },
          variables: {
            nom_projet: project.nomProjet,
          },
        }

        await deps.sendNotification(payload)
      },
      none: () => {},
    })
  }
