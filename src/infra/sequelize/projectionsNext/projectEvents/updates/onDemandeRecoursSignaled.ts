import { DemandeRecoursSignaled } from '../../../../../modules/project';
import { ProjectEvent } from '../projectEvent.model';
import { ProjectEventProjector } from '../projectEvent.projector';

export default ProjectEventProjector.on(
  DemandeRecoursSignaled,
  async ({ payload, id, occurredAt }, transaction) => {
    const { projectId, decidedOn, signaledBy, status, notes, attachments } = payload;

    await ProjectEvent.create(
      {
        projectId,
        type: DemandeRecoursSignaled.type,
        valueDate: decidedOn,
        eventPublishedAt: occurredAt.getTime(),
        id,
        payload: {
          signaledBy,
          status,
          ...(notes && { notes }),
          ...(attachments.length > 0 && { attachment: attachments[0] }),
        },
      },
      { transaction },
    );
  },
);
