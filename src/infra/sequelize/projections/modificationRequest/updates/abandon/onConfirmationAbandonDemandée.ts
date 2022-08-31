import { logger } from '@core/utils'
import { ConfirmationAbandonDemandée } from '@modules/demandeModification'

export const onConfirmationAbandonDemandée =
  (models) =>
  async ({ payload, occurredAt }: ConfirmationAbandonDemandée) => {
    const { demandeAbandonId, demandéePar, fichierRéponseId } = payload
    try {
      const ModificationRequestModel = models.ModificationRequest

      await ModificationRequestModel.update(
        {
          status: 'en attente de confirmation',
          confirmationRequestedBy: demandéePar,
          confirmationRequestedOn: occurredAt.getTime(),
          versionDate: occurredAt,
          responseFileId: fichierRéponseId,
        },
        { where: { id: demandeAbandonId } }
      )
    } catch (e) {
      logger.error(e)
    }
  }
