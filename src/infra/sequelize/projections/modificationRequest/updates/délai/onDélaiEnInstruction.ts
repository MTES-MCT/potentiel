import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { DélaiEnInstruction } from '@modules/demandeModification'

export const onDélaiEnInstruction = (models) => async (évènement: DélaiEnInstruction) => {
  const {
    payload: { demandeDélaiId },
    occurredAt,
  } = évènement
  try {
    const ModificationRequestModel = models.ModificationRequest

    await ModificationRequestModel.update(
      {
        status: 'en instruction',
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
      new ProjectionEnEchec(`Erreur lors du traitement de l'évènement DélaiEnInstruction`, {
        nomProjection: 'ProjectEventProjector.onDélaiEnInstruction',
        évènement,
      })
    )
  }
}
