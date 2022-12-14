import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { ModificationRequestAccepted } from '@modules/modificationRequest'
import { ProjectionEnEchec } from '@modules/shared'
import { Transaction } from 'sequelize'
import models from '../../../models'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  ModificationRequestAccepted,
  async (évènement, transaction) => {
    const {
      payload: { modificationRequestId, responseFileId, params },
      occurredAt,
    } = évènement

    const { ModificationRequest } = models

    const { projectId } = await ModificationRequest.findByPk(modificationRequestId, {
      attributes: ['projectId'],
      transaction,
    })

    if (projectId) {
      const file = responseFileId && (await getFile(responseFileId, transaction))

      try {
        await ProjectEvent.create(
          {
            projectId,
            type: 'ModificationRequestAccepted',
            valueDate: occurredAt.getTime(),
            eventPublishedAt: occurredAt.getTime(),
            id: new UniqueEntityID().toString(),
            payload: { modificationRequestId, ...(file && { file }) },
          },
          { transaction }
        )
      } catch (error) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'événement ModificationRequestAccepted : ajout de ModificationRequestAccepted`,
            {
              évènement,
              nomProjection: 'ProjectEvent.onModificationRequestAccepted',
            },
            error
          )
        )
      }

      if (params?.type === 'recours') {
        try {
          await ProjectEvent.create(
            {
              projectId,
              type: 'DateMiseEnService',
              valueDate: occurredAt.getTime(),
              eventPublishedAt: occurredAt.getTime(),
              id: new UniqueEntityID().toString(),
              payload: { statut: 'non-renseignée' },
            },
            { transaction }
          )
        } catch (error) {
          logger.error(
            new ProjectionEnEchec(
              `Erreur lors du traitement de l'événement ModificationRequestAccepted : ajout de DateMiseEnService`,
              {
                évènement,
                nomProjection: 'ProjectEvent.onModificationRequestAccepted',
              },
              error
            )
          )
        }
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
