import { UniqueEntityID } from '@core/domain'
import { ProjectImported } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectImported,
  async (
    {
      payload: {
        projectId,
        data: { notifiedOn },
      },
      occurredAt,
    },
    transaction
  ) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectImported.type,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { notifiedOn },
      },
      { transaction }
    )
  }
)
