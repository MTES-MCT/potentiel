import { RecoursAccepted } from '../../../../../modules/modificationRequest/events'

export const onRecoursAccepted = (models) => async (event: RecoursAccepted) => {
  const ModificationRequestModel = models.ModificationRequest
  const instance = await ModificationRequestModel.findByPk(event.payload.modificationRequestId)

  if (!instance) {
    console.log('Error: onRecoursAccepted projection failed to retrieve project from db', event)
    return
  }

  instance.status = 'acceptée'
  instance.versionDate = event.occurredAt

  try {
    await instance.save()
  } catch (e) {
    console.error('Error: onRecoursAccepted projection failed to update project', event, e.message)
  }
}
