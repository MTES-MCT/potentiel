import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectDCRRemoved } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export const onProjectDCRRemoved = ProjectEvent.projector.on(
  ProjectDCRRemoved,
  async ({ payload: { projectId, removedBy }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectDCRRemoved.type,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { removedBy },
      },
      { transaction }
    )
  }
)
