import { logger } from '@core/utils'
import { DatesMiseEnServiceImportées } from '@modules/project'

export const onDatesMiseEnServiceImportées =
  (models) => async (évènement: DatesMiseEnServiceImportées) => {
    const { TacheDeFond } = models
    const {
      id,
      payload: { utilisateurId },
    } = évènement
    try {
      await TacheDeFond.create({
        id,
        typeTache: 'mise-à-jour-date-mise-en-service',
        utilisateurId,
        statut: 'en cours',
        dateDebut: new Date().toString(),
      })
    } catch (e) {
      console.error(e)
      logger.error(e)
      logger.info(
        `Erreur: échec du handler onDatesMiseEnServiceImportées lors de l'ajout d'une nouvelle tâche dans tacheDeFond`,
        évènement
      )
    }
  }
