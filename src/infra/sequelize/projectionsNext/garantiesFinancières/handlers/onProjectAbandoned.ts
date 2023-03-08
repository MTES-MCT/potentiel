import { ProjectAbandoned } from '@modules/project';
import { GarantiesFinancières } from '../garantiesFinancières.model';
import { Project } from '../../project/project.model';
import { EventHandler } from '../../eventHandler';

export const onProjectAbandoned: EventHandler<ProjectAbandoned> = async (
  évènement,
  transaction,
) => {
  const {
    payload: { projectId: projetId },
  } = évènement;
  const projet = await Project.findOne({ where: { id: projetId }, transaction });

  if (projet?.abandonedOn === 0) {
    return;
  }

  await GarantiesFinancières.destroy({
    where: { projetId },
    transaction,
  });
};
