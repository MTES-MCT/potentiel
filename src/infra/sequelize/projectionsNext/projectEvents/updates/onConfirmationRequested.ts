import { UniqueEntityID } from '@core/domain'
import { ConfirmationRequested } from '@modules/modificationRequest'
import models from '../../../models'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  ConfirmationRequested,
  async ({ payload: { modificationRequestId, responseFileId }, occurredAt }, transaction) => {
    const { ModificationRequest } = models
    const { File } = models
    const rawFilename = await File.findByPk(responseFileId, {
      attributes: ['filename'],
    })

    const filename: string | undefined = rawFilename?.filename
    const file = filename && { id: responseFileId, name: filename }

    const { projectId } = await ModificationRequest.findByPk(modificationRequestId, {
      attributes: ['projectId'],
      transaction,
    })

    if (projectId) {
      await ProjectEvent.create(
        {
          projectId,
          type: 'ConfirmationRequested',
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          id: new UniqueEntityID().toString(),
          payload: { modificationRequestId, ...(file && { file }) },
        },
        { transaction }
      )
    }
  }
)
