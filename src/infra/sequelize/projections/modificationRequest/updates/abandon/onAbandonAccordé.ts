import { logger } from '@core/utils'
import { AbandonAccordé, AbandonAnnulé } from '@modules/demandeModification'

export const onAbandonAccordé =
  (models) =>
  async ({ payload, occurredAt }: AbandonAccordé) => {
    const { demandeAbandonId, accordéPar, fichierRéponseId } = payload
    try {
      const ModificationRequestModel = models.ModificationRequest

      await ModificationRequestModel.update(
        {
          status: 'acceptée',
          respondedOn: occurredAt.getTime(),
          respondedBy: accordéPar,
          versionDate: occurredAt,
          responseFileId: fichierRéponseId,
        },
        { where: { id: demandeAbandonId } }
      )
    } catch (e) {
      logger.error(e)
    }
  }
