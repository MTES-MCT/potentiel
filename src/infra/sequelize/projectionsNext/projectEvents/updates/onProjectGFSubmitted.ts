import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectGFSubmitted } from '../../../../../modules/project'
import models from '../../../models'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectGFSubmitted,
  async ({ payload: { projectId, fileId, gfDate }, occurredAt }, transaction) => {
    const { File } = models
    const rawFilename = await File.findOne({
      attributes: ['filename'],
      where: { id: fileId },
    })
    const filename = rawFilename.filename

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
