import { ResponseTemplateDownloaded } from '../../../../../modules/modificationRequest/events'

export const onResponseTemplateDownloaded = (models) => async (
  event: ResponseTemplateDownloaded
) => {
  const ModificationRequestModel = models.ModificationRequest
  const instance = await ModificationRequestModel.findByPk(event.payload.modificationRequestId)

  if (!instance) {
    console.error(
      'Error: onResponseTemplateDownloaded projection failed to retrieve project from db',
      event
    )
    return
  }

  if (instance.status === 'envoyée') {
    instance.status = 'en instruction'
  }

  try {
    await instance.save()
  } catch (e) {
    console.error(
      'Error: onResponseTemplateDownloaded projection failed to update project',
      event,
      e.message
    )
  }
}
