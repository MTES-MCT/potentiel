import { ProjectCompletionDueDateCancelled, ProjectCompletionDueDateSet } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectCompletionDueDateCancelled,
  async ({ payload: { projectId }, occurredAt }, transaction) => {
    await ProjectEvent.destroy({
      where: {
        projectId,
        type: ProjectCompletionDueDateSet.type,
      },
      transaction,
    })
  }
)
