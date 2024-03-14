import { FileDetachedFromProject } from '../../../../../modules/file';
import { ProjectEvent } from '../projectEvent.model';
import { ProjectEventProjector } from '../projectEvent.projector';

export default ProjectEventProjector.on(
  FileDetachedFromProject,
  async ({ payload: { attachmentId } }, transaction) => {
    await ProjectEvent.destroy({
      where: { id: attachmentId, type: 'FileAttachedToProject' },
      transaction,
    });
  },
);
