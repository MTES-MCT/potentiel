import { GarantiesFinancièresValidées } from '@modules/project'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancières, GarantiesFinancièresProjector } from '../garantiesFinancières.model'

export default GarantiesFinancièresProjector.on(
  GarantiesFinancièresValidées,
  async (évènement, transaction) => {
    const {
      payload: { projetId, validéesPar },
      occurredAt,
    } = évènement

    const entréeExistante = await GarantiesFinancières.findOne({
      where: { projetId },
      transaction,
    })

    if (!entréeExistante) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement GarantiesFinancièresValidées : ligne non trouvée`,
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
          statut: 'validé',
          validéesLe: occurredAt,
          validéesPar,
        },
        {
          where: { projetId },
          transaction,
        }
      )
    } catch (e) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'événement GarantiesFinancièresValidées`,
          {
            évènement,
            nomProjection: 'ProjectEvent.onGarantiesFinancièresValidées',
          },
          e
        )
      )
    }
  }
)
