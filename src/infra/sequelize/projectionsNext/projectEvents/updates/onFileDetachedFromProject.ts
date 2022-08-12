import { FileDetachedFromProject } from '../../../../../modules/file'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  FileDetachedFromProject,
  async ({ payload: { attachmentId } }, transaction) => {
    await ProjectEvent.destroy({
      where: { id: attachmentId, type: 'FileAttachedToProject' },
      transaction,
    })
  }
)
