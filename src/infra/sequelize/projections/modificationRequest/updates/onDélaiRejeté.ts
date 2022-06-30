import { logger } from '@core/utils'
import { DélaiRejeté } from '@modules/demandeModification'

export const onDélaiRejeté =
  (models) =>
  async ({ payload, occurredAt }: DélaiRejeté) => {
    const { demandeDélaiId, rejetéPar } = payload
    try {
      const ModificationRequestModel = models.ModificationRequest

      await ModificationRequestModel.update(
        {
          status: 'rejetée',
          respondedBy: rejetéPar,
          respondedOn: occurredAt.getTime(),
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
