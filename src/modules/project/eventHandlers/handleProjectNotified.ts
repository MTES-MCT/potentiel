import { GetFamille } from '../../appelOffre'
import { EventBus } from '../../eventStore'
import { ProjectNotified } from '../events'
import { ProjectCertificateGenerated } from '../events/ProjectCertificateGenerated'
import { ProjectCertificateGenerationFailed } from '../events/ProjectCertificateGenerationFailed'
import {
  GenerateCertificate,
  ProjectNotEligibleForCertificateError,
} from '../generateCertificate'

export const handleProjectNotified = (deps: {
  eventBus: EventBus
  generateCertificate: GenerateCertificate
  getFamille: GetFamille
}) => async (event: ProjectNotified) => {
  // console.log('handleProjectNotified', event)
  const { payload, requestId } = event
  const {
    projectId,
    periodeId,
    appelOffreId,
    candidateEmail,
    notifiedOn,
  } = payload

  let retries = 3
  let certificateFileId = ''
  while (retries-- > 0) {
    const result = await deps.generateCertificate(projectId, notifiedOn)
    if (result.isErr()) {
      if (result.error instanceof ProjectNotEligibleForCertificateError) {
        console.log(
          'handleProjectNotified generateCertificated failed because project is not eligible for Certificate'
        )
        break
      }
      console.log(
        'handleProjectNotified generateCertificated failed' +
          (retries > 0 ? ', retrying' : ' for the 3rd time, aborting.'),
        result.error
      )

      if (retries === 0) {
        await deps.eventBus.publish(
          new ProjectCertificateGenerationFailed({
            payload: {
              projectId,
              candidateEmail,
              periodeId,
              appelOffreId,
              error: result.error.message,
            },
            requestId,
          })
        )
      }
    } else {
      // console.log('handleProjectNotified generateCertificated succeeded')
      certificateFileId = result.value
      break
    }
  }

  if (retries >= 0 && certificateFileId) {
    await deps.eventBus.publish(
      new ProjectCertificateGenerated({
        payload: {
          projectId,
          candidateEmail,
          periodeId,
          appelOffreId,
          certificateFileId,
        },
        requestId,
      })
    )
  }
}
