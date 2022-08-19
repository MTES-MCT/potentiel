import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { ModificationRequestRejected } from '@modules/modificationRequest'
import { ProjectionEnEchec } from '@modules/shared'
import models from '../../../models'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  ModificationRequestRejected,
  async (evenement, transaction) => {
    const {
      payload: { modificationRequestId, responseFileId, rejectedBy },
      occurredAt,
    } = evenement

    const demandeDélai = await ProjectEvent.findOne({
      where: { id: modificationRequestId, type: 'DemandeDélai' },
      transaction,
    })

    if (demandeDélai) {
      try {
        await ProjectEvent.update(
          {
            valueDate: occurredAt.getTime(),
            eventPublishedAt: occurredAt.getTime(),
            payload: {
              //@ts-ignore
              ...demandeDélai.payload,
              statut: 'rejetée',
              rejetéPar: rejectedBy,
            },
          },
          { where: { id: modificationRequestId, type: 'DemandeDélai' }, transaction }
        )
        return
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
      const { ModificationRequest } = models

      const { projectId } = await ModificationRequest.findByPk(modificationRequestId, {
        attributes: ['projectId'],
        transaction,
      })

      if (projectId) {
        const { File } = models
        const rawFilename = await File.findByPk(responseFileId, {
          attributes: ['filename'],
          transaction,
        })

        const filename: string | undefined = rawFilename?.filename
        const file = filename && { id: responseFileId, name: filename }

        await ProjectEvent.create(
          {
            projectId,
            type: 'ModificationRequestRejected',
            valueDate: occurredAt.getTime(),
            eventPublishedAt: occurredAt.getTime(),
            id: new UniqueEntityID().toString(),
            payload: { modificationRequestId, ...(file && { file }) },
          },
          { transaction }
        )
      }
    }
  }
)
