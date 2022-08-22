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

      const demandeDélai = await ModificationRequestModel.findOne({
        where: { id: demandeDélaiId, type: 'delai' },
      })

      if (demandeDélai) {
        await ModificationRequestModel.update(
          {
            payload: {
              status: 'envoyée',
              authority: autorité,
              dateAchèvementDemandée,
              userId: porteurId,
            },
          },
          {
            where: { id: demandeDélaiId },
          }
        )
        return
      }

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
