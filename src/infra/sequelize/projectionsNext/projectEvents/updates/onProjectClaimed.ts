import { UniqueEntityID } from '@core/domain';
import { ProjectClaimed } from '@modules/projectClaim';
import { ProjectEvent } from '../projectEvent.model';
import { ProjectEventProjector } from '../projectEvent.projector';

export default ProjectEventProjector.on(
  ProjectClaimed,
  async (
    { payload: { projectId, attestationDesignationFileId, claimedBy }, occurredAt },
    transaction,
  ) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectClaimed.type,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: {
          attestationDesignationFileId,
          claimedBy,
        },
      },
      { transaction },
    );
  },
);
