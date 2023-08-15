import { ProjectDCRDueDateCancelled, ProjectDCRDueDateSet } from '../../../../../modules/project';
import { ProjectEvent } from '../projectEvent.model';
import { ProjectEventProjector } from '../projectEvent.projector';

export default ProjectEventProjector.on(
  ProjectDCRDueDateCancelled,
  async ({ payload: { projectId }, occurredAt }, transaction) => {
    await ProjectEvent.destroy({
      where: {
        projectId,
        type: ProjectDCRDueDateSet.type,
      },
      transaction,
    });
  },
);
