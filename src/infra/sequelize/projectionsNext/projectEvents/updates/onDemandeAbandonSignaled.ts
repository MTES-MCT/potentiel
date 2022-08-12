import { DemandeAbandonSignaled } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  DemandeAbandonSignaled,
  async ({ payload, id, occurredAt }, transaction) => {
    const { projectId, decidedOn, signaledBy, status, notes, attachments } = payload

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
          notes,
          attachment: attachments.length > 0 ? attachments[0] : undefined,
        },
      },
      { transaction }
    )
  }
)
