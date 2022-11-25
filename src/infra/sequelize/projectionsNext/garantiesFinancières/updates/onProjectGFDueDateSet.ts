import { logger } from '@core/utils'
import { ProjectGFDueDateSet } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancières, GarantiesFinancièresProjector } from '../garantiesFinancières.model'

export default GarantiesFinancièresProjector.on(
  ProjectGFDueDateSet,
  async (évènement, transaction) => {
    const {
      payload: { projectId: projetId, garantiesFinancieresDueOn },
    } = évènement

    const entréeExistante = await GarantiesFinancières.findOne({ where: { projetId } })

    if (!entréeExistante) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectGFDueDateSet : entrée non trouvée`,
          {
            évènement,
            nomProjection: 'GarantiesFinancières',
          }
        )
      )
      return
    }

    try {
      await GarantiesFinancières.update(
        {
          dateLimiteEnvoi: new Date(garantiesFinancieresDueOn),
        },
        { where: { projetId }, transaction }
      )
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectGFDueDateSet`,
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
