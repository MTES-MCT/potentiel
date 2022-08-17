import { DemandeDelaiSignaled } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  DemandeDelaiSignaled,
  async ({ payload, id, occurredAt }, transaction) => {
    const { projectId, decidedOn, signaledBy, status, notes, attachments } = payload

    await ProjectEvent.create(
      {
        projectId,
        type: DemandeDelaiSignaled.type,
        valueDate: decidedOn,
        eventPublishedAt: occurredAt.getTime(),
        id,
        payload: {
          signaledBy,
          status,
          ...(status === 'acceptée' && {
            oldCompletionDueOn: payload.oldCompletionDueOn,
            newCompletionDueOn: payload.newCompletionDueOn,
          }),
          ...(notes && { notes }),
          ...(attachments.length > 0 && { attachment: attachments[0] }),
        },
      },
      { transaction }
    )
  }
)
