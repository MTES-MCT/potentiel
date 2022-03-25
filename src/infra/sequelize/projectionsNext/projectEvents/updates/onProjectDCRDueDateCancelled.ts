import { ProjectDCRDueDateCancelled, ProjectDCRDueDateSet } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
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
