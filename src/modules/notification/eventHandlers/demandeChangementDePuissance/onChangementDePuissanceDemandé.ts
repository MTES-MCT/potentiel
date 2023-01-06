import { logger } from '@core/utils'
import { ProjectRepo, UserRepo } from '@dataAccess'
import { ChangementDePuissanceDemandé } from '@modules/demandeModification'
import routes from '@routes'
import { NotificationService } from '../..'
import { GetInfoForModificationRequested } from '../../queries'

type OnChangementDePuissanceDemandé = (evenement: ChangementDePuissanceDemandé) => Promise<void>

type MakeOnChangementDePuissanceDemandé = (dépendances: {
  sendNotification: NotificationService['sendNotification']
  getInfoForModificationRequested: GetInfoForModificationRequested
  findUsersForDreal: UserRepo['findUsersForDreal']
  findProjectById: ProjectRepo['findById']
}) => OnChangementDePuissanceDemandé

export const makeOnChangementDePuissanceDemandé: MakeOnChangementDePuissanceDemandé =
  ({ sendNotification, getInfoForModificationRequested, findUsersForDreal, findProjectById }) =>
  async ({
    payload: { demandeChangementDePuissanceId, projetId: projectId, demandéPar: userId },
  }) => {
    await getInfoForModificationRequested({ projectId, userId }).match(
      async ({ nomProjet, porteurProjet: { fullName, email } }) => {
        await sendNotification({
          type: 'modification-request-status-update',
          message: {
            email,
            name: fullName,
            subject: `Votre demande de changement de puissance pour le projet ${nomProjet}`,
          },
          context: {
            modificationRequestId: demandeChangementDePuissanceId,
            userId,
          },
          variables: {
            nom_projet: nomProjet,
            type_demande: 'puissance',
            status: 'envoyée',
            modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeChangementDePuissanceId),
            document_absent: '', // injecting an empty string will prevent the default "with document" message to be injected in the email body
          },
        })
      },
      (e: Error) => {
        logger.error(e)
      }
    )

    const project = await findProjectById(projectId)

    if (project) {
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
                  subject: `Potentiel - Nouvelle demande de type changement de puissance dans votre département ${project.departementProjet}`,
                },
                context: {
                  modificationRequestId: demandeChangementDePuissanceId,
                  projectId: project.id,
                  dreal: region,
                  userId: drealUser.id,
                },
                variables: {
                  nom_projet: project.nomProjet,
                  departement_projet: project.departementProjet,
                  type_demande: 'puissance',
                  modification_request_url: routes.DEMANDE_PAGE_DETAILS(
                    demandeChangementDePuissanceId
                  ),
                },
              })
            )
          )
        })
      )
    }
  }
