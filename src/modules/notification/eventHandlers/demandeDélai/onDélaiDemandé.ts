import { logger } from '@core/utils'
import { ProjectRepo, UserRepo } from '@dataAccess'
import { DélaiDemandé } from '@modules/demandeModification'
import routes from '@routes'
import { NotificationService } from '../..'
import { GetInfoForModificationRequested } from '../../queries'

type OnDélaiDemandé = (evenement: DélaiDemandé) => Promise<void>

type MakeOnDélaiDemandé = (dépendances: {
  sendNotification: NotificationService['sendNotification']
  getInfoForModificationRequested: GetInfoForModificationRequested
  findUsersForDreal: UserRepo['findUsersForDreal']
  findProjectById: ProjectRepo['findById']
}) => OnDélaiDemandé

export const makeOnDélaiDemandé: MakeOnDélaiDemandé =
  ({ sendNotification, getInfoForModificationRequested, findUsersForDreal, findProjectById }) =>
  async ({ payload: { demandeDélaiId, projetId: projectId, porteurId: userId, autorité } }) => {
    await getInfoForModificationRequested({ projectId, userId }).match(
      async ({ nomProjet, porteurProjet: { fullName, email } }) => {
        await sendNotification({
          type: 'modification-request-status-update',
          message: {
            email,
            name: fullName,
            subject: `Votre demande de délai pour le projet ${nomProjet}`,
          },
          context: {
            modificationRequestId: demandeDélaiId,
            userId,
          },
          variables: {
            nom_projet: nomProjet,
            type_demande: 'delai',
            status: 'envoyée',
            modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeDélaiId),
            document_absent: '', // injecting an empty string will prevent the default "with document" message to be injected in the email body
          },
        })
      },
      (e: Error) => {
        logger.error(e)
      }
    )

    const project = await findProjectById(projectId)

    if (project && autorité === 'dreal') {
      const regions = project.regionProjet.split(' / ')
      await Promise.all(
        regions.map(async (region) => {
          const drealUsers = await findUsersForDreal(region)

          await Promise.all(
            drealUsers.map((drealUser) =>
              sendNotification({
                type: 'admin-modification-requested',
                message: {
                  email: drealUser.email,
                  name: drealUser.fullName,
                  subject: `Potentiel - Nouvelle demande de type délai dans votre département ${project.departementProjet}`,
                },
                context: {
                  modificationRequestId: demandeDélaiId,
                  projectId: project.id,
                  dreal: region,
                  userId: drealUser.id,
                },
                variables: {
                  nom_projet: project.nomProjet,
                  departement_projet: project.departementProjet,
                  type_demande: 'delai',
                  modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeDélaiId),
                },
              })
            )
          )
        })
      )
    }
  }
