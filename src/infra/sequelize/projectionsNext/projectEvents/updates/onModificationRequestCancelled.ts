import { UniqueEntityID } from '@core/domain'
import { ModificationRequestCancelled } from '@modules/modificationRequest'
import { logger } from '@core/utils'
import models from '../../../models'
import { ProjectEvent } from '../projectEvent.model'
import { ProjectionEnEchec } from '@modules/shared'

export default ProjectEvent.projector.on(
  ModificationRequestCancelled,
  async (événement, transaction) => {
    const {
      payload: { cancelledBy, modificationRequestId },
      occurredAt,
    } = événement

    const { ModificationRequest } = models

    const modificationRequest = await ModificationRequest.findByPk(modificationRequestId, {
      attributes: ['projectId', 'type'],
      transaction,
    })

    if (!modificationRequest) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'événement ModificationRequestCancelled : modificationRequest non trouvée`,
          {
            evenement: événement,
            nomProjection: 'ProjectEvent.onModificationRequestCancelled',
          }
        )
      )
      return
    }

    // demandes de délai
    if (modificationRequest.type === 'delai') {
      const demandeDélai = await ProjectEvent.findOne({
        where: { id: modificationRequestId },
        transaction,
      })

      if (!demandeDélai) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'événement ModificationRequestCancelled : demande non trouvée`,
            {
              evenement: événement,
              nomProjection: 'ProjectEvent.onModificationRequestCancelled',
            }
          )
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
              ...demandeDélai.payload,
              statut: 'annulée',
              annuléPar: cancelledBy,
            },
          },
          { where: { id: modificationRequestId }, transaction }
        )
      } catch (e) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'événement ModificationRequestCancelled à la mise à jour de l'événement de type DemandeDélai`,
            {
              evenement: événement,
              nomProjection: 'ProjectEvent.onModificationRequestCancelled',
            },
            e
          )
        )
      }
      return
    }

    // autres demandes
    await ProjectEvent.create(
      {
        projectId: modificationRequest.projectId,
        type: 'ModificationRequestCancelled',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { modificationRequestId },
      },
      { transaction }
    )
  }
)
