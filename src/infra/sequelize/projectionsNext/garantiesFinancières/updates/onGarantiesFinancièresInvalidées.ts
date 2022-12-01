import { GarantiesFinancièresInvalidées } from '@modules/project'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancières, GarantiesFinancièresProjector } from '../garantiesFinancières.model'

export default GarantiesFinancièresProjector.on(
  GarantiesFinancièresInvalidées,
  async (évènement, transaction) => {
    const {
      payload: { projetId },
    } = évènement

    const entréeExistante = await GarantiesFinancières.findOne({
      where: { projetId },
      transaction,
    })

    if (!entréeExistante) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement GarantiesFinancièresInvalidées : ligne non trouvée`,
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
          statut: 'à traiter',
          validéesLe: null,
          validéesPar: null,
        },
        {
          where: { projetId },
          transaction,
        }
      )
    } catch (e) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'événement GarantiesFinancièresInvalidées`,
          {
            évènement,
            nomProjection: 'ProjectEvent.onGarantiesFinancièresInvalidées',
          },
          e
        )
      )
    }
  }
)
