import { NotificationService } from '..'
import { ProjectRepo, UserRepo } from '@dataAccess'
import { logger } from '@core/utils'
import { NouveauCahierDesChargesChoisi } from '../../project'

type OnNouveauCahierDesChargesChoisi = (dépendances: {
  sendNotification: NotificationService['sendNotification']
  findProjectById: ProjectRepo['findById']
  findUserById: UserRepo['findById']
}) => (événement: NouveauCahierDesChargesChoisi) => Promise<void>

export const onNouveauCahierDesChargesChoisi: OnNouveauCahierDesChargesChoisi =
  ({ sendNotification, findProjectById, findUserById }) =>
  async ({ payload: { projetId: projectId, choisiPar: optedInBy, paruLe, alternatif } }) => {
    const project = await findProjectById(projectId)

    if (!project) {
      logger.error(new Error('onNouveauCahierDesChargesChoisi failed because project is not found'))
      return
    }

    ;(await findUserById(optedInBy)).match({
      some: async ({ email, fullName }) => {
        const payload: any = {
          type: 'pp-nouveau-cdc-choisi',
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
            cdc_date: paruLe,
            cdc_alternatif: alternatif ? 'alternatif ' : '',
          },
        }

        await sendNotification(payload)
      },
      none: () => {},
    })
  }
