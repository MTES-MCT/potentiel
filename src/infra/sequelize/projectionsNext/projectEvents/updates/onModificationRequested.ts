import { UniqueEntityID } from '@core/domain'
import { ModificationRequested } from '@modules/modificationRequest'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ModificationRequested,
  async (
    { payload: { projectId, type, delayInMonths, modificationRequestId, authority }, occurredAt },
    transaction
  ) => {
    if (type !== 'delai') {
      return
    }

    await ProjectEvent.create(
      {
        projectId,
        type: 'ModificationRequested',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { modificationType: type, modificationRequestId, delayInMonths, authority },
      },
      { transaction }
    )
  }
)
