import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { ModificationRequestRejected } from '@modules/modificationRequest'
import { ProjectionEnEchec } from '@modules/shared'
import models from '../../../models'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ModificationRequestRejected,
  async (evenement, transaction) => {
    const {
      payload: { modificationRequestId, responseFileId, rejectedBy },
      occurredAt,
    } = evenement
    const { ModificationRequest } = models
    const { File } = models
    const rawFilename = await File.findByPk(responseFileId, {
      attributes: ['filename'],
      transaction,
    })

    const filename: string | undefined = rawFilename?.filename
    const file = filename && { id: responseFileId, name: filename }

    const { projectId, type } = await ModificationRequest.findByPk(modificationRequestId, {
      attributes: ['projectId', 'type'],
    })

    if (type === 'delai') {
      const projectEvent = await ProjectEvent.findOne({
        where: { id: modificationRequestId },
        transaction,
      })

      if (!projectEvent) {
        logger.error(
          new ProjectionEnEchec(`L'événement pour la demande n'a pas été retrouvé`, {
            evenement,
            nomProjection: 'ProjectEvent.onModificationRequestRejected',
          })
        )
        return
      }

      try {
        await ProjectEvent.update(
          {
            valueDate: occurredAt.getTime(),
            eventPublishedAt: occurredAt.getTime(),
            payload: {
              //@ts-ignore
              ...projectEvent.payload,
              statut: 'rejetée',
              rejetéPar: rejectedBy,
            },
          },
          { where: { id: modificationRequestId }, transaction }
        )
      } catch (e) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'événement ModificationRequestRejected`,
            {
              evenement,
              nomProjection: 'ProjectEvent.onModificationRequestRejected',
            },
            e
          )
        )
      }
    } else {
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
  }
)
