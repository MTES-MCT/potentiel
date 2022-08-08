import { UniqueEntityID } from '@core/domain'
import { ModificationRequestAccepted } from '@modules/modificationRequest'
import models from '../../../models'
import { ProjectEvent } from '../projectEvent.model'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'

export default ProjectEvent.projector.on(
  ModificationRequestAccepted,
  async (événement, transaction) => {
    const { ModificationRequest } = models
    const { File } = models
    let file: {} | undefined = {}

    const {
      payload: { modificationRequestId, responseFileId, params, acceptedBy },
      occurredAt,
    } = événement

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

    if (!projectId) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'événement ModificationRequestAccepted : modificationRequest non trouvée`,
          {
            evenement: événement,
            nomProjection: 'ProjectEvent.onModificationRequestAccepted',
          }
        )
      )
      return
    }

    if (params?.type === 'delai') {
      const demandeDélai = await ProjectEvent.findOne({
        where: { id: modificationRequestId },
        transaction,
      })

      if (!demandeDélai) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'événement ModificationRequestAccepted : demande non trouvée`,
            {
              evenement: événement,
              nomProjection: 'ProjectEvent.onModificationRequestAccepted',
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
              statut: 'accordée',
              accordéePar: acceptedBy,
              délaiEnMoisAccordé: params.delayInMonths,
              file,
            },
          },
          { where: { id: modificationRequestId }, transaction }
        )
      } catch (e) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'événement ModificationRequestAccepted à la mise à jour de l'événement de type DemandeDélai`,
            {
              evenement: événement,
              nomProjection: 'ProjectEvent.onModificationRequestAccepted',
            },
            e
          )
        )
      }
      return
    }

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
        },
      },
      { transaction }
    )
  }
)
