import { NotificationService } from '..'
import moment from 'moment'
import { ProjectRepo, UserRepo } from '../../../dataAccess'
import routes from '../../../routes'
import { ProjectGFSubmitted } from '../../project/events'
import { logger } from '../../../core/utils'

export const handleProjectGFSubmitted = (deps: {
  sendNotification: NotificationService['sendNotification']
  findUsersForDreal: UserRepo['findUsersForDreal']
  findUserById: UserRepo['findById']
  findProjectById: ProjectRepo['findById']
}) => async (event: ProjectGFSubmitted) => {
  const { projectId, submittedBy } = event.payload

  const project = await deps.findProjectById(projectId)

  if (!project) {
    logger.error(new Error('handleProjectGFSubmitted failed because project is not found'))
    return
  }

  // Send user email
  ;(await deps.findUserById(submittedBy)).match({
    some: async ({ email, fullName }) => {
      await deps.sendNotification({
        type: 'pp-gf-notification',
        message: {
          email,
          name: fullName,
          subject: "Confirmation d'envoi des garanties financières",
        },
        context: {
          projectId,
          userId: submittedBy,
        },
        variables: {
          nomProjet: project.nomProjet,
          dreal: project.regionProjet,
          date_depot: moment(event.occurredAt).format('DD/MM/YYYY'),
        },
      })
    },
    none: () => {},
  })

  // Send dreal email for each dreal of each region
  const regions = project.regionProjet.split(' / ')
  await Promise.all(
    regions.map(async (region) => {
      // Notifiy existing dreal users
      const drealUsers = await deps.findUsersForDreal(region)
      await Promise.all(
        drealUsers.map((drealUser) =>
          deps.sendNotification({
            type: 'dreal-gf-notification',
            message: {
              email: drealUser.email,
              name: drealUser.fullName,
              subject:
                'Potentiel - Nouveau dépôt de garantie financière dans votre région, département ' +
                project.departementProjet,
            },
            context: {
              projectId: project.id,
              dreal: region,
              userId: drealUser.id,
            },
            variables: {
              nomProjet: project.nomProjet,
              departementProjet: project.departementProjet,
              invitation_link: routes.ADMIN_DASHBOARD,
            },
          })
        )
      )
    })
  )
}
