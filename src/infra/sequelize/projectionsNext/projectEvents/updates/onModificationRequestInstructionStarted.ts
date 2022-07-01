import { UniqueEntityID } from '@core/domain'
import { ModificationRequestInstructionStarted } from '@modules/modificationRequest'
import models from '../../../models'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ModificationRequestInstructionStarted,
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
          type: 'ModificationRequestInstructionStarted',
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
