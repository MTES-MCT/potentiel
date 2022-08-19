import { ProjectDCRDueDateCancelled, ProjectDCRDueDateSet } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  ProjectDCRDueDateCancelled,
  async ({ payload: { projectId }, occurredAt }, transaction) => {
    await ProjectEvent.destroy({
      where: {
        projectId,
        type: ProjectDCRDueDateSet.type,
      },
      transaction,
    })
  }
)
