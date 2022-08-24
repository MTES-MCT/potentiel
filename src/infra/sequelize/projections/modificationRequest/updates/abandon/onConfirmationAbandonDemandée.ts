import { logger } from '@core/utils'
import { ConfirmationAbandonDemandée } from '../../../../../../modules/demandeModification/demandeAbandon/events/ConfirmationAbandonDemandée'

export const onConfirmationAbandonDemandée =
  (models) =>
  async ({ payload, occurredAt }: ConfirmationAbandonDemandée) => {
    const { demandeAbandonId, demandéePar } = payload
    try {
      const ModificationRequestModel = models.ModificationRequest

      await ModificationRequestModel.update(
        {
          status: 'en attente de confirmation',
        },
        { where: { id: demandeAbandonId } }
      )
    } catch (e) {
      logger.error(e)
    }
  }
