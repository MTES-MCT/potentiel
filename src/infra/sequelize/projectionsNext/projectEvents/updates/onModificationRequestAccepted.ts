import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { ModificationRequestAccepted } from '@modules/modificationRequest'
import { ProjectionEnEchec } from '@modules/shared'
import { Transaction } from 'sequelize'
import models from '../../../models'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ModificationRequestAccepted,
  async (evenement, transaction) => {
    const {
      payload: { modificationRequestId, responseFileId, acceptedBy, params },
      occurredAt,
    } = evenement

    const demandeDélai = await ProjectEvent.findOne({
      where: { id: modificationRequestId, type: 'DemandeDélai' },
      transaction,
    })

    if (demandeDélai && params?.type === 'delai') {
      try {
        await ProjectEvent.update(
          {
            valueDate: occurredAt.getTime(),
            eventPublishedAt: occurredAt.getTime(),
            payload: {
              //@ts-ignore
              ...demandeDélai.payload,
              statut: 'accordée',
              accordéPar: acceptedBy,
              délaiEnMoisAccordé: params.delayInMonths,
            },
          },
          { where: { id: modificationRequestId, type: 'DemandeDélai' }, transaction }
        )
        return
      } catch (e) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'événement ModificationRequestAccepted`,
            {
              evenement,
              nomProjection: 'ProjectEvent.onModificationRequestAccepted',
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
        const file = responseFileId && (await getFile(responseFileId, transaction))

        await ProjectEvent.create(
          {
            projectId,
            type: 'ModificationRequestAccepted',
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

const getFile = async (responseFileId: string, transaction: Transaction | undefined) => {
  const { File } = models
  const rawFilename = await File.findByPk(responseFileId, {
    attributes: ['filename'],
    transaction,
  })

  const filename: string | undefined = rawFilename?.filename
  const file = filename && { id: responseFileId, name: filename }

  return file
}
