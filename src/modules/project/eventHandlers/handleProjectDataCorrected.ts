import { GetFamille } from '../../appelOffre'
import { EventBus } from '../../eventStore'
import {
  ProjectCertificateUpdated,
  ProjectCertificateUpdateFailed,
  ProjectDataCorrected,
} from '../events'
import { ProjectCertificateGenerated } from '../events/ProjectCertificateGenerated'
import { ProjectCertificateGenerationFailed } from '../events/ProjectCertificateGenerationFailed'
import {
  GenerateCertificate,
  ProjectNotEligibleForCertificateError,
} from '../generateCertificate'

export const handleProjectDataCorrected = (deps: {
  eventBus: EventBus
  generateCertificate: GenerateCertificate
}) => async (event: ProjectDataCorrected) => {
  // console.log('handleProjectDataCorrected', event)
  const { payload, requestId } = event
  const { projectId, correctedData, certificateFileId, notifiedOn } = payload

  let newCertificateFileId = certificateFileId

  if (!certificateFileId) {
    const result = await deps.generateCertificate(projectId, notifiedOn)

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
