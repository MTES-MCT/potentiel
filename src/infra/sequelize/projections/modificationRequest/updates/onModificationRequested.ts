import { logger } from '@core/utils'
import { ModificationRequested } from '@modules/modificationRequest'

export const onModificationRequested =
  (models) =>
  async ({ payload, occurredAt }: ModificationRequested) => {
    const ModificationRequestModel = models.ModificationRequest

    const {
      modificationRequestId,
      type,
      projectId,
      fileId,
      justification,
      requestedBy,
      authority,
    } = payload

    if (type === 'delai') {
      return
    }

    try {
      await ModificationRequestModel.create({
        id: modificationRequestId,
        projectId,
        type,
        requestedOn: occurredAt.getTime(),
        versionDate: occurredAt,
        status: 'envoyée',
        fileId,
        userId: requestedBy,
        justification,
        puissance: type === 'puissance' ? payload.puissance : undefined,
        puissanceAuMomentDuDepot:
          type === 'puissance' ? payload.puissanceAuMomentDuDepot : undefined,
        actionnaire: type === 'actionnaire' ? payload.actionnaire : undefined,
        authority,
      })
    } catch (e) {
      logger.error(e)
    }
  }
