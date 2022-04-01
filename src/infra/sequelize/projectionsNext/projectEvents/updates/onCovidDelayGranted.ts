import { UniqueEntityID } from '@core/domain'
import { CovidDelayGranted } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  CovidDelayGranted,
  async ({ payload: { projectId }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: CovidDelayGranted.type,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: {},
      },
      { transaction }
    )
  }
)
