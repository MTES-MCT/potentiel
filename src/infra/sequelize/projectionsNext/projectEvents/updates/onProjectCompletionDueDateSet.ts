import { UniqueEntityID } from '@core/domain';
import { ProjectCompletionDueDateSet } from '@modules/project';
import { ProjectEvent } from '../projectEvent.model';
import { ProjectEventProjector } from '../projectEvent.projector';

export default ProjectEventProjector.on(
  ProjectCompletionDueDateSet,
  async ({ payload: { projectId, completionDueOn, reason }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectCompletionDueDateSet.type,
        eventPublishedAt: occurredAt.getTime(),
        valueDate: completionDueOn,
        id: new UniqueEntityID().toString(),
        payload: { ...(reason && { reason }) },
      },
      { transaction },
    );
  },
);
