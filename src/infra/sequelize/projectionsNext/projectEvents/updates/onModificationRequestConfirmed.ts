import { UniqueEntityID } from '@core/domain'
import { ModificationRequestConfirmed } from '@modules/modificationRequest'
import models from '../../../models'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  ModificationRequestConfirmed,
  async ({ payload: { modificationRequestId }, occurredAt }, transaction) => {
    const { ModificationRequest } = models
    const { projectId } = await ModificationRequest.findByPk(modificationRequestId, {
      attributes: ['projectId'],
      transaction,
    })

    if (projectId) {
      await ProjectEvent.create(
        {
          projectId,
          type: 'ModificationRequestConfirmed',
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          id: new UniqueEntityID().toString(),
          payload: { modificationRequestId },
        },
        { transaction }
      )
    }
  }
)
