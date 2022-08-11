import { logger } from '@core/utils'
import { DélaiEnInstruction } from '@modules/demandeModification'

export const onDélaiEnInstruction =
  (models) =>
  async ({ payload: { demandeDélaiId } }: DélaiEnInstruction) => {
    try {
      const ModificationRequestModel = models.ModificationRequest

      await ModificationRequestModel.update(
        {
          status: 'en instruction',
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
