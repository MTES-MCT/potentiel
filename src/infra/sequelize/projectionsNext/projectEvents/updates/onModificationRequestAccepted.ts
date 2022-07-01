import { UniqueEntityID } from '@core/domain'
import { ModificationRequestAccepted } from '@modules/modificationRequest'
import models from '../../../models'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ModificationRequestAccepted,
  async (
    { payload: { modificationRequestId, responseFileId, params }, occurredAt },
    transaction
  ) => {
    const { ModificationRequest } = models
    const { File } = models
    let file: {} | undefined = {}

    if (responseFileId) {
      const rawFilename = await File.findByPk(responseFileId, {
        attributes: ['filename'],
        transaction,
      })
      const filename = rawFilename?.filename
      file = filename && { id: responseFileId, name: filename }
    }

    const { projectId } = await ModificationRequest.findByPk(modificationRequestId, {
      attributes: ['projectId'],
      transaction,
    })

    if (projectId) {
      await ProjectEvent.create(
        {
          projectId,
          type: 'ModificationRequestAccepted',
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          id: new UniqueEntityID().toString(),
          payload: {
            modificationRequestId,
            file,
            ...(params &&
              params.type === 'delai' && { delayInMonthsGranted: params.delayInMonths }),
          },
        },
        { transaction }
      )
    }
  }
)
