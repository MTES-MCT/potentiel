import { logger } from '@core/utils'
import { AbandonAccordé, AbandonAnnulé, AbandonRejeté } from '@modules/demandeModification'

export const onAbandonRejeté =
  (models) =>
  async ({ payload, occurredAt }: AbandonRejeté) => {
    const { demandeAbandonId, rejetéPar, fichierRéponseId } = payload
    try {
      const ModificationRequestModel = models.ModificationRequest

      await ModificationRequestModel.update(
        {
          status: 'rejetée',
          respondedOn: occurredAt.getTime(),
          respondedBy: rejetéPar,
          versionDate: occurredAt,
          responseFileId: fichierRéponseId,
        },
        { where: { id: demandeAbandonId } }
      )
    } catch (e) {
      logger.error(e)
    }
  }
