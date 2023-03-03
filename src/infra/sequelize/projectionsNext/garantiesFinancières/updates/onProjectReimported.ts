import { ProjectReimported } from '@modules/project';
import { GarantiesFinancières } from '../garantiesFinancières.model';
import { getGarantiesFinancièresProjector } from '../garantiesFinancières.projector';

export default getGarantiesFinancièresProjector().on(
  ProjectReimported,
  async (évènement, transaction) => {
    const {
      payload: { projectId: projetId, data },
    } = évènement;
    if (data.classe === 'Eliminé') {
      await GarantiesFinancières.destroy({ where: { projetId }, transaction });
    }
    return;
  },
);
