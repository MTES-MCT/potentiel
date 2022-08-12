import { UniqueEntityID } from '@core/domain'
import { ProjectCompletionDueDateSet } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  ProjectCompletionDueDateSet,
  async ({ payload: { projectId, completionDueOn }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectCompletionDueDateSet.type,
        eventPublishedAt: occurredAt.getTime(),
        valueDate: completionDueOn,
        id: new UniqueEntityID().toString(),
      },
      { transaction }
    )
  }
)
