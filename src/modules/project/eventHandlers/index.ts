import { EventBus } from '../../../core/utils'
import {
  ProjectNotified,
  ProjectNotifiedPayload,
} from '../events/ProjectNotified'
import { GenerateCertificate } from '../generateCertificate'

export class ProjectHandlers {
  constructor(eventBus: EventBus, generateCertificate: GenerateCertificate) {
    console.log('ProjectHandlers have been initiated')

    eventBus.subscribe<ProjectNotified, ProjectNotifiedPayload>(
      'ProjectNotified',
      async (payload: ProjectNotifiedPayload) => {
        console.log(
          'ProjectHandlers caught ProjectNotified for ',
          payload.projectId
        )
        const result = await generateCertificate.execute(payload.projectId)

        console.log(
          'ProjectHandlers got result from generateCertificated for ',
          payload.projectId
        )

        if (result.isErr()) {
          console.log(
            'ProjectHandlers generateCertificated returned error',
            result.error
          )
        }
      }
    )
  }
}
