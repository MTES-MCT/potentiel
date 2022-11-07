import { logger } from '@core/utils'
import { TâcheMiseAJourDatesMiseEnServiceTerminée } from '@modules/imports/gestionnaireRéseau/events'
import { ProjectionEnEchec } from '@modules/shared'
import { TâchesProjector, Tâches } from '../tâches.model'

export default TâchesProjector.on(
  TâcheMiseAJourDatesMiseEnServiceTerminée,
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
            type: 'maj-date-mise-en-service',
          },
          transaction,
        }
      )
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement TâcheMiseAJourDatesMiseEnServiceTerminée`,
          { évènement, nomProjection: 'ProjectEvent.onTâcheMiseAJourDatesMiseEnServiceTerminée' },
          error
        )
      )
    }
  }
)
