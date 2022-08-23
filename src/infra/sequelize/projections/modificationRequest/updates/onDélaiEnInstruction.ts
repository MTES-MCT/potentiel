import { logger } from '@core/utils'
import { DélaiEnInstruction } from '@modules/demandeModification'

export const onDélaiEnInstruction =
  (models) =>
  async ({ payload: { demandeDélaiId }, occurredAt }: DélaiEnInstruction) => {
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
      logger.error(e)
    }
  }
