import { UniqueEntityID } from '../../../../../core/domain';
import { ProjectCompletionDueDateSet } from '../../../../../modules/project';
import { ProjectEvent } from '../projectEvent.model';
import { ProjectEventProjector } from '../projectEvent.projector';

export default ProjectEventProjector.on(
  ProjectCompletionDueDateSet,
  async ({ payload: { projectId, completionDueOn, reason }, occurredAt }, transaction) => {
    if (
      reason &&
      [
        'ChoixCDCAnnuleDélaiCdc2022',
        'DateMiseEnServiceAnnuleDélaiCdc2022',
        'DemandeComplèteRaccordementTransmiseAnnuleDélaiCdc2022',
      ].includes(reason)
    ) {
      await ProjectEvent.destroy({
        where: { type: ProjectCompletionDueDateSet.type, 'payload.reason': 'délaiCdc2022' },
        transaction,
      });
      return;
    }

    await ProjectEvent.create(
      {
        projectId,
        type: ProjectCompletionDueDateSet.type,
        eventPublishedAt: occurredAt.getTime(),
        valueDate: completionDueOn,
        id: new UniqueEntityID().toString(),
        payload: { ...(reason && { reason }) },
      },
      { transaction },
    );
  },
);
