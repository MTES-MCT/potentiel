import { FileAttachedToProject } from '../../../../../modules/file';
import { ProjectEvent } from '../projectEvent.model';
import { ProjectEventProjector } from '../projectEvent.projector';
import { User, UserDreal } from '../..';

export default ProjectEventProjector.on(
  FileAttachedToProject,
  async ({ payload: { projectId, date, attachedBy, ...payload }, occurredAt, id }, transaction) => {
    const user = await User.findOne({ where: { id: attachedBy }, transaction });

    const attachedByUser: {
      id: string;
      name?: string;
      administration?: string;
    } = { id: attachedBy };

    if (user) {
      attachedByUser.name = user.fullName;

      if (user.role === 'dgec-validateur' || user.role === 'admin') {
        attachedByUser.administration = 'DGEC';
      }

      if (user.role === 'dreal') {
        const region = await UserDreal.findOne({ where: { userId: attachedBy }, transaction });
        if (region) {
          attachedByUser.administration = `DREAL ${region.dreal}`;
        }
      }
    }

    await ProjectEvent.create(
      {
        projectId,
        type: FileAttachedToProject.type,
        valueDate: date,
        eventPublishedAt: occurredAt.getTime(),
        id,
        payload: { ...payload, attachmentId: id, attachedBy: attachedByUser },
      },
      { transaction },
    );
  },
);
