import { UniqueEntityID } from '@core/domain'
import { ProjectGFUploaded } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'
import models from '../../../models'
import { logger } from '@core/utils'

export default ProjectEvent.projector.on(
  ProjectGFUploaded,
  async (
    { payload: { projectId, fileId, gfDate, expirationDate, submittedBy }, occurredAt },
    transaction
  ) => {
    const { File } = models
    const rawFilename = await File.findOne({
      attributes: ['filename'],
      where: { id: fileId },
    })

    if (!rawFilename) {
      logger.error(
        new Error(
          `Impossible de trouver le fichier (id = ${fileId}) d'attestation GF pour le project ${projectId})`
        )
      )
    }

    const { User } = models
    const rawUser = await User.findOne({
      attributes: ['role'],
      where: { id: submittedBy },
    })

    if (!rawUser) {
      logger.error(
        new Error(
          `Impossible de trouver l'utilisateur (id = ${submittedBy}) émetteur d'une GF pour le project ${projectId})`
        )
      )
    }

    const filename: string | undefined = rawFilename?.filename
    const file = filename && { id: fileId, name: filename }

    await ProjectEvent.create(
      {
        projectId,
        type: ProjectGFUploaded.type,
        valueDate: gfDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: {
          file,
          expirationDate: expirationDate && expirationDate.getTime(),
          submittedByRole: rawUser && rawUser.role,
        },
      },
      { transaction }
    )
  }
)
