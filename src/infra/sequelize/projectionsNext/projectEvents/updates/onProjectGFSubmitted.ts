import { UniqueEntityID } from '@core/domain'
import { ProjectGFSubmitted } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'
import models from '../../../models'
import { logger } from '@core/utils'

export default ProjectEventProjector.on(
  ProjectGFSubmitted,
  async ({ payload: { projectId, fileId, gfDate, expirationDate }, occurredAt }, transaction) => {
    const { File } = models
    const rawFilename = await File.findOne({
      attributes: ['filename'],
      where: { id: fileId },
      transaction,
    })

    if (!rawFilename) {
      logger.error(
        new Error(
          `Impossible de trouver le fichier (id = ${fileId}) d'attestation GF pour le project ${projectId})`
        )
      )
    }

    const filename: string | undefined = rawFilename?.filename
    const file = filename && { id: fileId, name: filename }

    await ProjectEvent.create(
      {
        projectId,
        type: ProjectGFSubmitted.type,
        valueDate: gfDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { file, ...(expirationDate && { expirationDate: expirationDate.getTime() }) },
      },
      { transaction }
    )
  }
)
