import { logger } from '@core/utils'
import { TâcheMiseAJourDatesMiseEnServiceTerminée } from '@modules/imports/gestionnaireRéseau/events'
import { ProjectionEnEchec } from '@modules/shared'
import { TasksProjector, Tasks } from '../tasks.model'

export default TasksProjector.on(
  TâcheMiseAJourDatesMiseEnServiceTerminée,
  async (évènement, transaction) => {
    const { payload, occurredAt } = évènement
    const { résultat, tâcheId } = payload
    const { nombreDeSucces, nombreDEchecs } = countEchecsSuccess(résultat)

    try {
      Tasks.update(
        {
          dateDeFin: occurredAt,
          nombreDeSucces,
          nombreDEchecs,
        },
        {
          where: { id: tâcheId },
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
