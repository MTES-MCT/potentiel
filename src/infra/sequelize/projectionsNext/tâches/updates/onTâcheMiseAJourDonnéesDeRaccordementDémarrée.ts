import { logger } from '@core/utils'
import { TâcheMiseAJourDonnéesDeRaccordementDémarrée } from '@modules/imports/donnéesRaccordement/events'
import { ProjectionEnEchec } from '@modules/shared'
import { TâchesProjector, Tâches } from '../tâches.model'

export default TâchesProjector.on(
  TâcheMiseAJourDonnéesDeRaccordementDémarrée,
  async (évènement, transaction) => {
    const {
      payload: { gestionnaire },
      occurredAt,
    } = évènement

    try {
      await Tâches.create(
        {
          gestionnaire,
          type: 'maj-date-mise-en-service',
          état: 'en cours',
          dateDeDébut: occurredAt,
        },
        {
          transaction,
        }
      )
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement TâcheMiseAJourDonnéesDeRaccordementDémarrée`,
          {
            évènement,
            nomProjection: 'ProjectEvent.onTâcheMiseAJourDonnéesDeRaccordementDémarrée',
          },
          error
        )
      )
    }
  }
)
