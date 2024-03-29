import { UniqueEntityID } from '../../../../../core/domain';
import { ProjectNotified } from '../../../../../modules/project';
import { ProjectEvent } from '../projectEvent.model';
import { ProjectEventProjector } from '../projectEvent.projector';

export default ProjectEventProjector.on(
  ProjectNotified,
  async ({ payload: { projectId, notifiedOn }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectNotified.type,
        valueDate: notifiedOn,
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
      },
      { transaction },
    );
  },
);
