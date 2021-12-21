import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectGFSubmitted } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectGFSubmitted,
  async ({ payload: { projectId, fileId, submittedBy }, occurredAt }) => {
    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: ProjectGFSubmitted.type,
      payload: { fileId, submittedBy },
      valueDate: occurredAt.getTime(),
    })
  }
)
