import { logger } from '@core/utils'
import { ModificationRequestStatusUpdated } from '@modules/modificationRequest'

export const onModificationRequestStatusUpdated =
  (models) => async (event: ModificationRequestStatusUpdated) => {
    const ModificationRequestModel = models.ModificationRequest
    const instance = await ModificationRequestModel.findByPk(event.payload.modificationRequestId)

    if (!instance) {
      logger.error(
        `Error: onModificationRequestStatusUpdated projection failed to retrieve project from db ${event}`
      )
      return
    }

    const {
      occurredAt,
      payload: { updatedBy, newStatus },
    } = event

    Object.assign(instance, {
      status: newStatus,
      respondedOn: occurredAt.getTime(),
      respondedBy: updatedBy,
      versionDate: occurredAt,
    })

    try {
      await instance.save()
    } catch (e) {
      logger.error(e)
      logger.info(
        'Error: onModificationRequestStatusUpdated projection failed to update project :',
        event
      )
    }
  }
