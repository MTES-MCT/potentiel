import { ModificationRequestAccepted } from '../../../../../modules/modificationRequest/events'

export const onModificationRequestAccepted = (models) => async (
  event: ModificationRequestAccepted
) => {
  const ModificationRequestModel = models.ModificationRequest
  const instance = await ModificationRequestModel.findByPk(event.payload.modificationRequestId)

  if (!instance) {
    console.error(
      'Error: onModificationRequestAccepted projection failed to retrieve project from db',
      event
    )
    return
  }

  instance.status = 'acceptée'
  instance.respondedOn = event.occurredAt.getTime()
  instance.respondedBy = event.payload.acceptedBy
  instance.versionDate = event.occurredAt

  try {
    await instance.save()
  } catch (e) {
    console.error(
      'Error: onModificationRequestAccepted projection failed to update project',
      event,
      e.message
    )
  }
}
