import { UniqueEntityID } from '@core/domain'
import { ProjectDCRDueDateSet } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
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
