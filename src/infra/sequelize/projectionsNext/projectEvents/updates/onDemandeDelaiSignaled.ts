import { DemandeDelaiSignaled } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
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
            newCompletionDueOn: payload.newCompletionDueOn,
            isNewDateApplicable: payload.isNewDateApplicable,
          }),
          notes,
          attachment: attachments.length > 0 ? attachments[0] : undefined,
        },
      },
      { transaction }
    )
  }
)
