import { logger } from '@core/utils'
import { AbandonDemandé } from '@modules/demandeModification'

export const onAbandonDemandé =
  (models) =>
  async ({ payload, occurredAt }: AbandonDemandé) => {
    const { demandeAbandonId, projetId, fichierId, justification, autorité, porteurId } = payload
    try {
      const ModificationRequestModel = models.ModificationRequest

      await ModificationRequestModel.create({
        id: demandeAbandonId,
        projectId: projetId,
        type: 'abandon',
        requestedOn: occurredAt.getTime(),
        versionDate: occurredAt,
        status: 'envoyée',
        fileId: fichierId,
        userId: porteurId,
        justification,
        authority: autorité,
      })
    } catch (e) {
      logger.error(e)
    }
  }
