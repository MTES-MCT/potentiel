import { UniqueEntityID } from '@core/domain'
import { ModificationRequestRejected } from '@modules/modificationRequest'
import models from '../../../models'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ModificationRequestRejected,
  async ({ payload: { modificationRequestId, responseFileId }, occurredAt }, transaction) => {
    const { ModificationRequest } = models
    const { File } = models
    const rawFilename = await File.findByPk(responseFileId, {
      attributes: ['filename'],
      transaction,
    })

    const filename: string | undefined = rawFilename?.filename
    const file = filename && { id: responseFileId, name: filename }

    const { projectId } = await ModificationRequest.findByPk(modificationRequestId, {
      attributes: ['projectId'],
    })

    if (projectId) {
      await ProjectEvent.create(
        {
          projectId,
          type: 'ModificationRequestRejected',
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          id: new UniqueEntityID().toString(),
          payload: { modificationRequestId, file },
        },
        { transaction }
      )
    }
  }
)
