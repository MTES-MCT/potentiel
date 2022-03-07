import { ProjectEvent } from '../projectEvent.model'
import { ProjectGFWithdrawn } from '@modules/project'
import { UniqueEntityID } from '@core/domain'

export default ProjectEvent.projector.on(
  ProjectGFWithdrawn,
  async ({ payload: { projectId }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectGFWithdrawn.type,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
      },
      { transaction }
    )
  }
)
