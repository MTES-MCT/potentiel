import { UniqueEntityID } from '@core/domain'
import { DemandeDelaiSignaled } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  DemandeDelaiSignaled,
  async (
    {
      payload: {
        projectId,
        decidedOn,
        signaledBy,
        newCompletionDueOn,
        isAccepted,
        isNewDateApplicable,
        notes,
        attachments,
      },
      occurredAt,
    },
    transaction
  ) => {
    await ProjectEvent.create(
      {
        projectId,
        type: DemandeDelaiSignaled.type,
        valueDate: decidedOn,
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: {
          signaledBy,
          newCompletionDueOn,
          isAccepted,
          isNewDateApplicable,
          notes,
          attachment: attachments.length > 0 ? attachments[0] : undefined,
        },
      },
      { transaction }
    )
  }
)
