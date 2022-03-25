import { FileDetachedFromProject } from '../../../../../modules/file'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  FileDetachedFromProject,
  async ({ payload: { attachmentId } }, transaction) => {
    await ProjectEvent.destroy({ where: { id: attachmentId, type: 'FileAttachedToProject' } })
  }
)
