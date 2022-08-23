import { logger } from '@core/utils'
import { AbandonAnnulé } from '@modules/demandeModification'

export const onAbandonAnnulé =
  (models) =>
  async ({ payload, occurredAt }: AbandonAnnulé) => {
    const { demandeAbandonId, annuléPar } = payload
    try {
      const ModificationRequestModel = models.ModificationRequest

      await ModificationRequestModel.update(
        {
          status: 'annulée',
          cancelledBy: annuléPar,
          cancelledOn: occurredAt.getTime(),
        },
        { where: { id: demandeAbandonId } }
      )
    } catch (e) {
      logger.error(e)
    }
  }
