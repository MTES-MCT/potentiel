import { UniqueEntityID } from '@core/domain'
import { ModificationRequestInstructionStarted } from '@modules/modificationRequest'
import models from '../../../models'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  ModificationRequestInstructionStarted,
  async (evenement, transaction) => {
    const {
      payload: { modificationRequestId },
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
              statut: 'en-instruction',
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
  }
)
