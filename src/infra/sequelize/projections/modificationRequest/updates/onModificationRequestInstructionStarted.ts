import { ModificationRequestInstructionStarted } from '../../../../../modules/modificationRequest/events'

export const onModificationRequestInstructionStarted = (models) => async (
  event: ModificationRequestInstructionStarted
) => {
  const ModificationRequestModel = models.ModificationRequest
  const instance = await ModificationRequestModel.findByPk(event.payload.modificationRequestId)

  if (!instance) {
    console.error(
      'Error: onModificationRequestInstructionStarted projection failed to retrieve project from db',
      event
    )
    return
  }

  instance.status = 'en instruction'

  try {
    await instance.save()
  } catch (e) {
    console.error(
      'Error: onModificationRequestInstructionStarted projection failed to update project',
      event,
      e.message
    )
  }
}
