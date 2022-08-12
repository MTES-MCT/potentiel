import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'
import { ProjectGFRemoved } from '@modules/project'
import { UniqueEntityID } from '@core/domain'

export default ProjectEventProjector.on(
  ProjectGFRemoved,
  async ({ payload: { projectId }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectGFRemoved.type,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
      },
      { transaction }
    )
  }
)
