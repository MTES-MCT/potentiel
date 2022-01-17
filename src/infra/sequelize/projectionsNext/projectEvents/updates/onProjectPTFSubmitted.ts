import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectPTFSubmitted } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'
import models from '../../../models'

export default ProjectEvent.projector.on(
  ProjectPTFSubmitted,
  async ({ payload: { projectId, fileId, ptfDate }, occurredAt }, transaction) => {
    const { File } = models
    const rawFilename = await File.findOne({
      attributes: ['filename'],
      where: { id: fileId },
    })
    const filename = rawFilename?.filename

    await ProjectEvent.create(
      {
        projectId,
        type: ProjectPTFSubmitted.type,
        valueDate: ptfDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { fileId, filename },
      },
      { transaction }
    )
  }
)
