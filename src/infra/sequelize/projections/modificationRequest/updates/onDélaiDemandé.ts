import { logger } from '@core/utils'
import { DélaiDemandé } from '@modules/demandeModification'

export const onDélaiDemandé =
  (models) =>
  async ({ payload, occurredAt }: DélaiDemandé) => {
    const {
      demandeDélaiId,
      projetId,
      fichierId,
      justification,
      autorité,
      dateAchèvementDemandée,
      porteurId,
    } = payload
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
      logger.error(e)
    }
  }
