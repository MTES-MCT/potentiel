import { UniqueEntityID } from '@core/domain'
import { ModificationRequested } from '@modules/modificationRequest'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ModificationRequested,
  async ({ payload, occurredAt }, transaction) => {
    const { projectId, type, modificationRequestId, authority } = payload
    if (!['delai', 'abandon', 'recours'].includes(type)) {
      return
    }

    await ProjectEvent.create(
      {
        projectId,
        type: 'ModificationRequested',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: {
          modificationType: type,
          modificationRequestId,
          authority,
          ...(type === 'delai' && { delayInMonths: payload.delayInMonths }),
        },
      },
      { transaction }
    )
  }
)
