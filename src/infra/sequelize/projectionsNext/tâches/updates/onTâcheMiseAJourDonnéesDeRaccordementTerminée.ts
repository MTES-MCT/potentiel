import { logger } from '@core/utils'
import { TâcheMiseAJourDonnéesDeRaccordementTerminée } from '@modules/imports/donnéesRaccordement/events'
import { ProjectionEnEchec } from '@modules/shared'
import { TâchesProjector, Tâches } from '../tâches.model'

export default TâchesProjector.on(
  TâcheMiseAJourDonnéesDeRaccordementTerminée,
  async (évènement, transaction) => {
    const {
      payload: { résultat, gestionnaire },
      occurredAt,
    } = évènement

    const succès = résultat.filter((r): r is typeof r & { état: 'succès' } => r.état === 'succès')
    const ignorés = résultat.filter((r): r is typeof r & { état: 'ignoré' } => r.état === 'ignoré')
    const erreurs = résultat.filter((r): r is typeof r & { état: 'échec' } => r.état === 'échec')

    try {
      await Tâches.update(
        {
          état: 'terminée',
          dateDeFin: occurredAt,
          résultat: {
            succès,
            ignorés,
            erreurs,
          },
        },
        {
          where: {
            gestionnaire,
            état: 'en cours',
            type: 'maj-données-de-raccordement',
          },
          transaction,
        }
      )
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement TâcheMiseAJourDonnéesDeRaccordementTerminée`,
          {
            évènement,
            nomProjection: 'ProjectEvent.onTâcheMiseAJourDonnéesDeRaccordementTerminée',
          },
          error
        )
      )
    }
  }
)
