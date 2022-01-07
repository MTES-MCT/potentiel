import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectGFSubmitted } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectGFSubmitted,
  async ({ payload: { projectId, fileId, submittedBy, gfDate }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectGFSubmitted.type,
        valueDate: gfDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { fileId, submittedBy },
      },
      { transaction }
    )
  }
)
