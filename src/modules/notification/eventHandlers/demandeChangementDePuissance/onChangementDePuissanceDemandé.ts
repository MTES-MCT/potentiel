import { NotificationService } from '../..'
import { logger } from '@core/utils'
import { ProjectRepo, UserRepo } from '@dataAccess'
import routes from '@routes'
import { ChangementDePuissanceDemandé } from '@modules/demandeModification/demandeChangementDePuissance/events'

export const onChangementDePuissanceDemandé =
  (deps: {
    sendNotification: NotificationService['sendNotification']
    findUsersForDreal: UserRepo['findUsersForDreal']
    findProjectById: ProjectRepo['findById']
    findUserById: UserRepo['findById']
  }) =>
  async ({ payload: { demandeId, projetId, demandéPar } }: ChangementDePuissanceDemandé) => {
    const project = await deps.findProjectById(projetId)

    if (!project) {
      logger.error(new Error('onChangementDePuissanceDemandé failed because project is not found'))
      return
    }

    // Send user email
    ;(await deps.findUserById(demandéPar)).match({
      some: async ({ email, fullName }) => {
        const notificationPayload = {
          type: 'pp-modification-received' as 'pp-modification-received',
          message: {
            email: email,
            name: fullName,
            subject: `Potentiel - Nouvelle information de type puissance enregistrée pour votre projet ${project.nomProjet}`,
          },
          context: {
            modificationRequestId: demandeId,
            projectId: project.id,
            userId: demandéPar,
          },
          variables: {
            nom_projet: project.nomProjet,
            type_demande: 'puissance',
            button_url: routes.USER_LIST_REQUESTS,
            button_title: 'Consulter la demande',
            button_instructions: `Pour la consulter, connectez-vous à Potentiel.`,
            demande_action_pp: undefined as string | undefined,
          },
        }

        await deps.sendNotification(notificationPayload)
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
                subject: `Potentiel - Nouvelle information de type puissance enregistrée dans votre département ${project.departementProjet}`,
              },
              context: {
                modificationRequestId: demandeId,
                projectId: project.id,
                dreal: region,
                userId: drealUser.id,
              },
              variables: {
                nom_projet: project.nomProjet,
                departement_projet: project.departementProjet,
                type_demande: 'puissance',
                modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeId),
              },
            })
          )
        )
      })
    )
  }
