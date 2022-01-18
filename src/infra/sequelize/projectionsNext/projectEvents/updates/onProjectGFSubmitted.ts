import { UniqueEntityID } from '@core/domain'
import { ProjectGFSubmitted } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'
import models from '../../../models'
import { logger } from '@core/utils'

export default ProjectEvent.projector.on(
  ProjectGFSubmitted,
  async ({ payload: { projectId, fileId, gfDate }, occurredAt }, transaction) => {
    const { File } = models
    const rawFilename = await File.findOne({
      attributes: ['filename'],
      where: { id: fileId },
    })

    if (!rawFilename) {
      logger.error(
        `Error: onProjectGFSubmitted projection failed to retrieve filename from db File`
      )
    }

    const filename: string | undefined = rawFilename?.filename

    await ProjectEvent.create(
      {
        projectId,
        type: ProjectGFSubmitted.type,
        valueDate: gfDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { fileId, filename },
      },
      { transaction }
    )
  }
)
