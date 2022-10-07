import { logger } from '@core/utils'
import { ImportDatesDeMiseEnServiceDémarré } from '@modules/project'

export const onImportDatesDeMiseEnServiceDémarré =
  (models) => async (évènement: ImportDatesDeMiseEnServiceDémarré) => {
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
        `Erreur: échec du handler onImportDatesDeMiseEnServiceDémarré lors de l'ajout d'une nouvelle tâche dans tacheDeFond`,
        évènement
      )
    }
  }
