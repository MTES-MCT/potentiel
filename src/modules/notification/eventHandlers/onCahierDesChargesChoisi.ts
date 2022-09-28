import { NotificationService } from '..'
import { ProjectRepo, UserRepo } from '@dataAccess'
import { logger } from '@core/utils'
import { CahierDesChargesChoisi } from '../../project'
import routes from '@routes'

type OnCahierDesChargesChoisi = (dépendances: {
  sendNotification: NotificationService['sendNotification']
  findProjectById: ProjectRepo['findById']
  findUserById: UserRepo['findById']
}) => (événement: CahierDesChargesChoisi) => Promise<void>

export const onCahierDesChargesChoisi: OnCahierDesChargesChoisi =
  ({ sendNotification, findProjectById, findUserById }) =>
  async ({ payload }) => {
    const { projetId: projectId, choisiPar: optedInBy, type } = payload
    const project = await findProjectById(projectId)

    if (!project) {
      logger.error(new Error('onNouveauCahierDesChargesChoisi failed because project is not found'))
      return
    }

    const mailjetTemplate = type === 'initial' ? 'pp-cdc-initial-choisi' : 'pp-cdc-modifié-choisi'

    const variables = {
      nom_projet: project.nomProjet,
      projet_url: routes.PROJECT_DETAILS(projectId),
      ...(type === 'modifié' && {
        cdc_date: payload.paruLe,
        cdc_alternatif: payload.alternatif ? 'alternatif ' : '',
      }),
    }

    ;(await findUserById(optedInBy)).match({
      some: async ({ email, fullName }) => {
        const payload: any = {
          type: mailjetTemplate,
          message: {
            email: email,
            name: fullName,
            subject: `Potentiel - Nouveau mode d'instruction choisi pour les demandes liées à votre projet ${project.nomProjet}`,
          },
          context: {
            projectId: project.id,
            userId: optedInBy,
          },
          variables,
        }

        await sendNotification(payload)
      },
      none: () => {},
    })
  }
