import { logger } from '@core/utils'
import { DélaiAnnulé } from '@modules/demandeModification'

export const onDélaiAnnulé =
  (models) =>
  async ({ payload, occurredAt }: DélaiAnnulé) => {
    const { demandeDélaiId, annuléPar } = payload
    try {
      const ModificationRequestModel = models.ModificationRequest

      await ModificationRequestModel.update(
        {
          status: 'annulée',
          cancelledBy: annuléPar,
          cancelledOn: occurredAt.getTime(),
        },
        {
          where: {
            id: demandeDélaiId,
          },
        }
      )
    } catch (e) {
      logger.error(e)
    }
  }
