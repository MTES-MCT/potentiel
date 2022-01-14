import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectPTFSubmitted } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectPTFSubmitted,
  async ({ payload: { projectId, fileId, ptfDate }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectPTFSubmitted.type,
        valueDate: ptfDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { fileId },
      },
      { transaction }
    )
  }
)
