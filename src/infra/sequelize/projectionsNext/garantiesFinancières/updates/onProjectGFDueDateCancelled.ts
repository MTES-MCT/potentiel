import { logger } from '@core/utils'
import { ProjectGFDueDateCancelled } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancières, GarantiesFinancièresProjector } from '../garantiesFinancières.model'

export default GarantiesFinancièresProjector.on(
  ProjectGFDueDateCancelled,
  async (évènement, transaction) => {
    const {
      payload: { projectId: projetId },
    } = évènement

    const entréeExistante = await GarantiesFinancières.findOne({ where: { projetId }, transaction })

    if (!entréeExistante) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectGFDueDateCancelled : ligne non trouvée`,
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
      delete entréeExistante.dataValues.dateLimiteEnvoi
      await GarantiesFinancières.create(
        {
          ...entréeExistante.dataValues,
        },
        { transaction }
      )
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectGFDueDateCancelled : création d'une nouvelle entrée`,
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
