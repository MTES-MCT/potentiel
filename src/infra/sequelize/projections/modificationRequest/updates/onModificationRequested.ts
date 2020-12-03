import { ModificationRequested } from '../../../../../modules/modificationRequest'

export const onModificationRequested = (models) => async (event: ModificationRequested) => {
  const ModificationRequestModel = models.ModificationRequest

  const {
    modificationRequestId,
    type,
    projectId,
    fileId,
    justification,
    requestedBy,
  } = event.payload
  try {
    await ModificationRequestModel.create({
      id: modificationRequestId,
      projectId,
      type,
      requestedOn: event.occurredAt.getTime(),
      status: 'envoyée',
      fileId,
      justification,
      userId: requestedBy,
    })
  } catch (e) {
    console.error(e)
  }
}
