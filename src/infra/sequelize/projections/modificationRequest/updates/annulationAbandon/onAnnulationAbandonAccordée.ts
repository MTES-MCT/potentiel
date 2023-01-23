import { logger } from '@core/utils'
import { AnnulationAbandonAccordée } from '@modules/demandeModification'

export const onAnnulationAbandonAccordée =
  (models) =>
  async ({ payload, occurredAt }: AnnulationAbandonAccordée) => {
    const { demandeId, accordéPar, fichierRéponseId } = payload
    try {
      const ModificationRequestModel = models.ModificationRequest

      await ModificationRequestModel.update(
        {
          status: 'acceptée',
          respondedBy: accordéPar,
          respondedOn: occurredAt.getTime(),
          versionDate: occurredAt,
          responseFileId: fichierRéponseId,
        },
        { where: { id: demandeId } }
      )
    } catch (e) {
      logger.error(e)
    }
  }
