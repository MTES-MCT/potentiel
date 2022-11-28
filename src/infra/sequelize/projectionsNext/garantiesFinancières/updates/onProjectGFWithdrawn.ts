import { logger } from '@core/utils'
import { ProjectGFWithdrawn } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancières, GarantiesFinancièresProjector } from '../garantiesFinancières.model'

export default GarantiesFinancièresProjector.on(
  ProjectGFWithdrawn,
  async (évènement, transaction) => {
    const {
      payload: { projectId: projetId },
    } = évènement

    const entréeExistante = await GarantiesFinancières.findOne({ where: { projetId }, transaction })

    if (!entréeExistante) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectGFWithdrawn : ligne non trouvée`,
          {
            évènement,
            nomProjection: 'GarantiesFinancières',
          }
        )
      )
      return
    }

    await GarantiesFinancières.destroy({ where: { projetId }, transaction })

    try {
      await GarantiesFinancières.create(
        {
          id: entréeExistante.id,
          projetId,
          soumisALaCandidature: entréeExistante.soumisALaCandidature,
          ...(entréeExistante.dateLimiteEnvoi && {
            dateLimiteEnvoi: entréeExistante.dateLimiteEnvoi,
          }),
          statut: 'en attente',
        },
        { transaction }
      )
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectGFWithdrawn : création d'une nouvelle entrée`,
          {
            évènement,
            nomProjection: 'GarantiesFinancières',
          },
          error
        )
      )
    }
  }
)
