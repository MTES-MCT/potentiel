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
        producteur: type === 'producteur' && payload.producteur,
        puissance: type === 'puissance' && payload.puissance,
        justification,
        fileId,
        actionnaire: type === 'actionnaire' && payload.actionnaire,
        fournisseurs: type === 'fournisseur' && payload.fournisseurs,
        evaluationCarbone: type === 'fournisseur' && payload.evaluationCarbone,
        authority,
      })
    } catch (e) {
      logger.error(e)
      logger.info('Error: onModificationReceived projection failed to update project :', event)
    }
  }
