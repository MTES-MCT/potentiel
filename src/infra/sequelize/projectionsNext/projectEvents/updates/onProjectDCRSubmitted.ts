import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectDCRSubmitted } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'
import models from '../../../models'
import { logger } from '../../../../../core/utils'

export default ProjectEvent.projector.on(
  ProjectDCRSubmitted,
  async ({ payload: { projectId, fileId, dcrDate }, occurredAt }, transaction) => {
    const { File } = models
    const rawFilename = await File.findOne({
      attributes: ['filename'],
      where: { id: fileId },
    })
    if (!rawFilename) {
      logger.error(
        `Error: onProjectDCRSubmitted projection failed to retrieve filename from db File`
      )
      return
    }
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectDCRSubmitted.type,
        valueDate: dcrDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { fileId, filename: rawFilename.filename },
      },
      { transaction }
    )
  }
)
