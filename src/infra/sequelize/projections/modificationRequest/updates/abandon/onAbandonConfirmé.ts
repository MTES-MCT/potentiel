import { logger } from '@core/utils'
import { AbandonConfirmé } from '@modules/demandeModification'

export const onAbandonConfirmé =
  (models) =>
  async ({ payload }: AbandonConfirmé) => {
    const { demandeAbandonId } = payload
    try {
      const ModificationRequestModel = models.ModificationRequest

      await ModificationRequestModel.update(
        {
          status: 'demande confirmée',
        },
        { where: { id: demandeAbandonId } }
      )
    } catch (e) {
      logger.error(e)
    }
  }
