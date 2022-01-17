import { UniqueEntityID } from '@core/domain'
import { ProjectDCRDueDateSet } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectDCRDueDateSet,
  async ({ payload: { projectId, dcrDueOn }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectDCRDueDateSet.type,
        eventPublishedAt: occurredAt.getTime(),
        valueDate: dcrDueOn,
        id: new UniqueEntityID().toString(),
      },
      { transaction }
    )
  }
)
