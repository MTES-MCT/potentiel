import { UniqueEntityID } from '@core/domain'
import { ModificationRequestCancelled } from '@modules/modificationRequest'
import models from '../../../models'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  ModificationRequestCancelled,
  async (evenement, transaction) => {
    const {
      payload: { modificationRequestId, cancelledBy },
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
              statut: 'annulée',
              annuléPar: cancelledBy,
            },
          },
          { where: { id: modificationRequestId, type: 'DemandeDélai' }, transaction }
        )
        return
      } catch (e) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'événement ModificationRequestCancelled`,
            {
              evenement,
              nomProjection: 'ProjectEvent.onModificationRequestCancelled',
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
  }
)
