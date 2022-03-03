import { logger } from '@core/utils'
import { ModificationReceived } from '@modules/modificationRequest'

export const onModificationReceived =
  (models) =>
  async ({ payload, occurredAt }: ModificationReceived) => {
    const ModificationRequestModel = models.ModificationRequest
    const {
      modificationRequestId,
      projectId,
      requestedBy,
      justification,
      fileId,
      type,
      authority,
    } = payload

    try {
      await ModificationRequestModel.create({
        id: modificationRequestId,
        projectId,
        requestedOn: occurredAt.getTime(),
        versionDate: occurredAt,
        status: 'information validée',
        type,
        userId: requestedBy,
        producteur: type === 'producteur' ? payload.producteur : undefined,
        puissance: type === 'puissance' ? payload.puissance : undefined,
        puissanceAuMomentDuDepot:
          type === 'puissance' ? payload.puissanceAuMomentDuDepot : undefined,
        justification,
        fileId,
        actionnaire: type === 'actionnaire' ? payload.actionnaire : undefined,
        fournisseurs: type === 'fournisseur' ? payload.fournisseurs : undefined,
        evaluationCarbone: type === 'fournisseur' ? payload.evaluationCarbone : undefined,
        authority,
      })
    } catch (e) {
      logger.error(e)
      logger.info('Error: onModificationReceived projection failed to update project :', event)
    }
  }
