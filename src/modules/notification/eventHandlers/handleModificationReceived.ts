import { NotificationService } from '..'
import { ProjectRepo, UserRepo } from '../../../dataAccess'
import routes from '../../../routes'
import { logger } from '../../../core/utils'
import { ModificationReceived } from '../../modificationRequest'
import moment from 'moment'
import { isStrictlyPositiveNumber } from '../../../helpers/formValidators'

export const handleModificationReceived = (deps: {
  sendNotification: NotificationService['sendNotification']
  findUsersForDreal: UserRepo['findUsersForDreal']
  findProjectById: ProjectRepo['findById']
  findUserById: UserRepo['findById']
}) => async (event: ModificationReceived) => {
  const { modificationRequestId, projectId, type, requestedBy, evaluationCarbone } = event.payload

  const project = await deps.findProjectById(projectId)

  if (!project) {
    logger.error(new Error('handleModificationReceived failed because project is not found'))
    return
  }

  // Send user email
  ;(await deps.findUserById(requestedBy)).match({
    some: async ({ email, fullName }) => {
      const payload: any = {
        type: 'pp-modification-received',
        message: {
          email: email,
          name: fullName,
          subject: `Potentiel - Nouvelle information de type ${type} enregistrée pour votre projet ${project.nomProjet}`,
        },
        context: {
          modificationRequestId,
          projectId: project.id,
          userId: requestedBy,
        },
        variables: {
          nom_projet: project.nomProjet,
          type_demande: type,
          modification_request_url: routes.USER_LIST_REQUESTS,
        },
      }

      if (['producteur', 'actionnaire'].includes(type))
        payload.variables.demande_action_pp = `Suite à votre signalement de changement de type ${type}, vous devez déposer de nouvelles garanties financières dans un délai d'un mois maximum.`

      const evaluationCarboneOutOfBounds =
        isStrictlyPositiveNumber(project.evaluationCarbone) &&
        Math.abs(project.evaluationCarbone - Number(evaluationCarbone)) > 50

      if (type === 'fournisseur' && evaluationCarboneOutOfBounds)
        payload.variables.demande_action_pp = `Vous venez d'effectuer une demande de changement de type ${type}. Vous avez modifié l'évaluation carbone de votre projet et la nouvelle valeur induit une évolution de plus de 50 kg eq CO2/kWc. Cela remet en cause l'offre déposée et votre projet ne recevra pas d'attestation de conformité.`

      await deps.sendNotification(payload)
    },
    none: () => {},
  })

  // Send dreal email for each dreal of each region
  const regions = project.regionProjet.split(' / ')
  await Promise.all(
    regions.map(async (region) => {
      const drealUsers = await deps.findUsersForDreal(region)

      await Promise.all(
        drealUsers.map((drealUser) =>
          deps.sendNotification({
            type: 'dreal-modification-received',
            message: {
              email: drealUser.email,
              name: drealUser.fullName,
              subject: `Potentiel - Nouvelle information de type ${type} enregistrée dans votre département ${project.departementProjet}`,
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
              modification_request_url: routes.ADMIN_LIST_REQUESTS,
            },
          })
        )
      )
    })
  )
}
