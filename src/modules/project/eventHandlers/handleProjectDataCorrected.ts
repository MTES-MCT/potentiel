import { EventBus } from '../../eventStore'
import {
  ProjectCertificateUpdated,
  ProjectCertificateUpdateFailed,
  ProjectDataCorrected,
  ProjectReimported,
} from '../events'
import {
  GenerateCertificate,
  ProjectNotEligibleForCertificateError,
} from '../generateCertificate'

export const handleProjectDataCorrected = (deps: {
  eventBus: EventBus
  generateCertificate: GenerateCertificate
}) => async (event: ProjectDataCorrected | ProjectReimported) => {
  // console.log('handleProjectDataCorrected', event)
  const { payload, requestId } = event
  const { projectId } = payload

  // Only regenerate certificate if project was notified
  if (event.type === ProjectReimported.type && !event.payload.notifiedOn) return

  let newCertificateFileId =
    event.type === ProjectDataCorrected.type
      ? event.payload.certificateFileId
      : undefined

  let newNotifiedOn =
    event.type === ProjectDataCorrected.type
      ? event.payload.notifiedOn
      : undefined

  if (!newCertificateFileId) {
    const result = await deps.generateCertificate(
      projectId,
      newNotifiedOn,
      event.type === ProjectReimported.type ? event.payload.data : undefined
    )

    if (result.isErr()) {
      if (result.error instanceof ProjectNotEligibleForCertificateError) {
        // console.log(
        //   'handleProjectDataCorrected generateCertificated failed because project is not eligible for Certificate'
        // )
        return
      }
      console.log(
        'handleProjectDataCorrected generateCertificated failed',
        result.error
      )
      await deps.eventBus.publish(
        new ProjectCertificateUpdateFailed({
          payload: {
            projectId,
            error: result.error.message,
          },
          requestId,
        })
      )
      return
    }

    newCertificateFileId = result.value
  }

  if (newCertificateFileId) {
    await deps.eventBus.publish(
      new ProjectCertificateUpdated({
        payload: { projectId, certificateFileId: newCertificateFileId },
        requestId,
      })
    )
  }
}
