import { logger } from '@core/utils'
import { AbandonConfirmé } from '@modules/demandeModification'

export const onAbandonConfirmé =
  (models) =>
  async ({ payload, occurredAt }: AbandonConfirmé) => {
    const { demandeAbandonId, confirméPar } = payload
    try {
      const ModificationRequestModel = models.ModificationRequest

      await ModificationRequestModel.update(
        {
          status: 'demande confirmée',
          confirmedBy: confirméPar,
          confirmedOn: occurredAt.getTime(),
          versionDate: occurredAt,
        },
        { where: { id: demandeAbandonId } }
      )
    } catch (e) {
      logger.error(e)
    }
  }
