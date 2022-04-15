import { UniqueEntityID } from '@core/domain'
import { CovidDelayGranted } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  CovidDelayGranted,
  async ({ payload: { projectId, completionDueOn }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: CovidDelayGranted.type,
        valueDate: completionDueOn,
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: {},
      },
      { transaction }
    )
  }
)
