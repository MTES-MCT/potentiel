import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectGFSubmitted } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectGFSubmitted,
  async ({ payload: { projectId, fileId, submittedBy, gfDate }, occurredAt }) => {
    await ProjectEvent.findOrCreate({
      where: {
        projectId,
        type: ProjectGFSubmitted.type,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
      },
      defaults: {
        id: new UniqueEntityID().toString(),
        payload: { fileId, submittedBy, gfDate: gfDate.getTime() },
      },
    })
  }
)
