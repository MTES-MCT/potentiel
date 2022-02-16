import { UniqueEntityID } from '@core/domain'
import { ModificationRequestCancelled } from '@modules/modificationRequest'
import models from '../../../models'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ModificationRequestCancelled,
  async ({ payload: { modificationRequestId }, occurredAt }, transaction) => {
    const { ModificationRequest } = models

    const { projectId } = await ModificationRequest.findByPk(modificationRequestId, {
      attributes: ['projectId'],
    })

    if (projectId) {
      await ProjectEvent.create(
        {
          projectId,
          type: 'ModificationRequestCancelled',
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
