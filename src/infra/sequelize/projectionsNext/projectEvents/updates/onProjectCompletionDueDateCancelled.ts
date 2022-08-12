import { ProjectCompletionDueDateCancelled, ProjectCompletionDueDateSet } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
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
