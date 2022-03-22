import { ProjectGFDueDateCancelled, ProjectGFDueDateSet } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectGFDueDateCancelled,
  async ({ payload: { projectId }, occurredAt }, transaction) => {
    await ProjectEvent.destroy({
      where: {
        projectId,
        type: ProjectGFDueDateSet.type,
      },
      transaction,
    })
  }
)
