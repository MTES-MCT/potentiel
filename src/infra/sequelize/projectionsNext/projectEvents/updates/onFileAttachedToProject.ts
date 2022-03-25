import { FileAttachedToProject } from '../../../../../modules/file'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  FileAttachedToProject,
  async ({ payload: { projectId, date, ...payload }, occurredAt, id }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: FileAttachedToProject.type,
        valueDate: date,
        eventPublishedAt: occurredAt.getTime(),
        id,
        payload: { ...payload, attachmentId: id },
      },
      { transaction }
    )
  }
)
