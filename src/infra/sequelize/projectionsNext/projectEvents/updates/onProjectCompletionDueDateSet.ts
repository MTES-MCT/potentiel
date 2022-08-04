import { UniqueEntityID } from '@core/domain'
import { ProjectCompletionDueDateSet } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
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
