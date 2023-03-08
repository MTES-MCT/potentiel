import { ProjectReimported } from '@modules/project';
import { EventHandler } from '../../eventHandler';
import { GarantiesFinancières } from '../garantiesFinancières.model';

export const onProjectReimported: EventHandler<ProjectReimported> = async (
  évènement,
  transaction,
) => {
  const {
    payload: { projectId: projetId, data },
  } = évènement;
  if (data.classe === 'Eliminé') {
    await GarantiesFinancières.destroy({ where: { projetId }, transaction });
  }
  return;
};
