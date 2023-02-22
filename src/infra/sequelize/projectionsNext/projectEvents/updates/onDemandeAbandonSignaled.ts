import { DemandeAbandonSignaled } from '@modules/project';
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model';

export default ProjectEventProjector.on(
  DemandeAbandonSignaled,
  async ({ payload, id, occurredAt }, transaction) => {
    const { projectId, decidedOn, signaledBy, status, notes, attachments } = payload;

    await ProjectEvent.create(
      {
        projectId,
        type: DemandeAbandonSignaled.type,
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
