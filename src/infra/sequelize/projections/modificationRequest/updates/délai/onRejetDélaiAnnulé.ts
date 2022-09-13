import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { RejetDélaiAnnulé } from '@modules/demandeModification'

export const onRejetDélaiAnnulé = (models) => async (évènement: RejetDélaiAnnulé) => {
  const {
    payload: { demandeDélaiId },
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
          id: demandeDélaiId,
        },
      }
    )
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(`Erreur lors du traitement de l'évènement RejetDélaiAnnulé`, {
        nomProjection: 'ProjectEventProjector.onRejetDélaiAnnulé',
        évènement,
      })
    )
  }
}
