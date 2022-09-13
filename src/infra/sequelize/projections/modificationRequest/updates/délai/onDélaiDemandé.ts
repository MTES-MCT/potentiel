import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { DélaiDemandé } from '@modules/demandeModification'

export const onDélaiDemandé = (models) => async (évènement: DélaiDemandé) => {
  const {
    payload: {
      demandeDélaiId,
      projetId,
      fichierId,
      justification,
      autorité,
      dateAchèvementDemandée,
      porteurId,
    },
    occurredAt,
  } = évènement
  try {
    const ModificationRequestModel = models.ModificationRequest

    await ModificationRequestModel.create({
      id: demandeDélaiId,
      projectId: projetId,
      type: 'delai',
      requestedOn: occurredAt.getTime(),
      versionDate: occurredAt,
      status: 'envoyée',
      fileId: fichierId,
      userId: porteurId,
      justification,
      authority: autorité,
      dateAchèvementDemandée,
    })
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(`Erreur lors du traitement de l'évènement DélaiDemandé`, {
        nomProjection: 'ProjectEventProjector.onDélaiDemandé',
        évènement,
      })
    )
  }
}
