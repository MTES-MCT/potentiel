import { UniqueEntityID } from '@core/domain'
import { ProjectPTFSubmitted } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'
import models from '../../../models'
import { logger } from '@core/utils'

export default ProjectEvent.projector.on(
  ProjectPTFSubmitted,
  async ({ payload: { projectId, fileId, ptfDate }, occurredAt }, transaction) => {
    const { File } = models
    const rawFilename = await File.findOne({
      attributes: ['filename'],
      where: { id: fileId },
      transaction,
    })

    if (!rawFilename) {
      logger.error(
        new Error(
          `Impossible de trouver le fichier (id = ${fileId}) d'attestation PTF pour le project ${projectId})`
        )
      )
    }
    const filename = rawFilename?.filename
    const file = filename && { id: fileId, name: filename }

    await ProjectEvent.create(
      {
        projectId,
        type: ProjectPTFSubmitted.type,
        valueDate: ptfDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { file },
      },
      { transaction }
    )
  }
)
