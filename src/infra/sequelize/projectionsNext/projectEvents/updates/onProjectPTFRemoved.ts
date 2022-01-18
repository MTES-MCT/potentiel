import { UniqueEntityID } from '@core/domain'
import { ProjectPTFRemoved } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectPTFRemoved,
  async ({ payload: { projectId }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectPTFRemoved.type,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
      },
      { transaction }
    )
  }
)
