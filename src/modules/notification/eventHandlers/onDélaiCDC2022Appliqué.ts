import { logger } from '@core/utils'
import { ProjectRepo } from '@dataAccess'
import { DélaiCDC2022Appliqué } from '@modules/project'
import routes from '@routes'
import { NotificationService } from '../NotificationService'

type OnDélaiCDC2022Appliqué = (évènement: DélaiCDC2022Appliqué) => Promise<void>

type MakeOnDélaiCDC2022Appliqué = (dépendances: {
  sendNotification: NotificationService['sendNotification']
  getProjectUsers: ProjectRepo['getUsers']
  getProjectById: ProjectRepo['findById']
}) => OnDélaiCDC2022Appliqué

export const makeOnDélaiCDC2022Appliqué: MakeOnDélaiCDC2022Appliqué =
  ({ sendNotification, getProjectUsers, getProjectById }) =>
  async ({ payload: { projetId } }) => {
    const destinatairesEmails = await getProjectUsers(projetId)
    if (!destinatairesEmails) return

    const projet = await getProjectById(projetId)
    if (!projet) {
      logger.error(`Notification handler onDélaiCDC2022Appliqué : projet ${projetId} non trouvé.`)
      return
    }

    for (const { email, fullName, id } of destinatairesEmails) {
      await sendNotification({
        type: 'pp-delai-cdc-2022-appliqué',
        context: { projetId, utilisateurId: id },
        variables: { nom_projet: projet.nomProjet, projet_url: routes.PROJECT_DETAILS(projetId) },
        message: {
          email,
          name: fullName,
          subject: `Potentiel - Nouveau délai appliqué pour votre projet ${projet.nomProjet}`,
        },
      })
    }
  }
