import { logger } from '@core/utils'
import { TâcheMiseAJourDatesMiseEnServiceDémarrée } from '@modules/imports/gestionnaireRéseau/events'
import { ProjectionEnEchec } from '@modules/shared'
import { TasksProjector, Tasks } from '../tasks.model'

export default TasksProjector.on(
  TâcheMiseAJourDatesMiseEnServiceDémarrée,
  async (évènement, transaction) => {
    const { payload, occurredAt } = évènement
    const { tâcheId } = payload

    try {
      Tasks.create(
        {
          id: tâcheId,
          type: 'maj-date-mise-en-service',
          dateDeDébut: occurredAt,
        },
        {
          transaction,
        }
      )
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement TâcheMiseAJourDatesMiseEnServiceDémarrée`,
          { évènement, nomProjection: 'ProjectEvent.onTâcheMiseAJourDatesMiseEnServiceDémarrée' },
          error
        )
      )
    }
  }
)
