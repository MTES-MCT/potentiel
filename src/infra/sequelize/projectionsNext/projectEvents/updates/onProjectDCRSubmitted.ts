import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectDCRSubmitted } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'
import models from '../../../models'

export default ProjectEvent.projector.on(
  ProjectDCRSubmitted,
  async ({ payload: { projectId, fileId, dcrDate }, occurredAt }, transaction) => {
    const { File } = models
    const rawFilename = await File.findOne({
      attributes: ['filename'],
      where: { id: fileId },
    })
    const filename = rawFilename.filename
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectDCRSubmitted.type,
        valueDate: dcrDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { fileId, filename },
      },
      { transaction }
    )
  }
)
