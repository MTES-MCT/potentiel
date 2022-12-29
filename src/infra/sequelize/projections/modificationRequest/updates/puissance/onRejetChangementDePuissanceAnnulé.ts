import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { RejetChangementDePuissanceAnnulé } from '@modules/demandeModification'

export const onRejetChangementDePuissanceAnnulé =
  (models) => async (évènement: RejetChangementDePuissanceAnnulé) => {
    const {
      payload: { demandeChangementDePuissanceId },
      occurredAt,
    } = évènement
    try {
      const ModificationRequestModel = models.ModificationRequest
      await ModificationRequestModel.update(
        {
          status: 'envoyée',
          respondedBy: null,
          respondedOn: null,
          responseFileId: null,
          versionDate: occurredAt,
        },
        {
          where: {
            id: demandeChangementDePuissanceId,
          },
        }
      )
    } catch (e) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement RejetChangementDePuissanceAnnulé`,
          {
            évènement,
            nomProjection: 'ProjectEventProjector.onRejetChangementDePuissanceAnnulé',
          },
          e
        )
      )
    }
  }
