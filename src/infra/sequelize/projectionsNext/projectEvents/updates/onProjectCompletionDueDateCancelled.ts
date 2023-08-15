import {
  ProjectCompletionDueDateCancelled,
  ProjectCompletionDueDateSet,
} from '../../../../../modules/project';
import { ProjectEvent } from '../projectEvent.model';
import { ProjectEventProjector } from '../projectEvent.projector';

export default ProjectEventProjector.on(
  ProjectCompletionDueDateCancelled,
  async ({ payload: { projectId }, occurredAt }, transaction) => {
    await ProjectEvent.destroy({
      where: {
        projectId,
        type: ProjectCompletionDueDateSet.type,
      },
      transaction,
    });
  },
);
