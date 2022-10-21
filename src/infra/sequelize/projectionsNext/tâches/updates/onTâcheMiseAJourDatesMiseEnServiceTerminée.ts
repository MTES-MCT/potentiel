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
    const { nombreDeSucces, nombreDEchecs } = countEchecsSuccess(résultat)

    try {
      await Tâches.update(
        {
          état: 'terminée',
          dateDeFin: occurredAt,
          nombreDeSucces,
          nombreDEchecs,
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

const countEchecsSuccess = (
  résultat: TâcheMiseAJourDatesMiseEnServiceTerminée['payload']['résultat']
) => {
  return résultat.reduce(
    ({ nombreDeSucces, nombreDEchecs }, { état }) => ({
      nombreDeSucces: état === 'succès' ? nombreDeSucces + 1 : nombreDeSucces,
      nombreDEchecs: état === 'échec' ? nombreDEchecs + 1 : nombreDEchecs,
    }),
    {
      nombreDeSucces: 0,
      nombreDEchecs: 0,
    }
  )
}
