import { UniqueEntityID } from '@core/domain'
import { ProjectGFUploaded } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'
import models from '../../../models'
import { logger } from '@core/utils'

export default ProjectEventProjector.on(
  ProjectGFUploaded,
  async (
    { payload: { projectId, fileId, gfDate, expirationDate, submittedBy }, occurredAt },
    transaction
  ) => {
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

    const { User } = models
    const rawUser = await User.findOne({
      attributes: ['role'],
      where: { id: submittedBy },
      transaction,
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
          uploadedByRole: rawUser && rawUser.role,
        },
      },
      { transaction }
    )
  }
)
