import { ProjectGFDueDateCancelled, ProjectGFDueDateSet } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
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
