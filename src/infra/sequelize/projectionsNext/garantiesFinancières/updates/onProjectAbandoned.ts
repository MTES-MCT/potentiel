import { ProjectAbandoned } from '@modules/project';
import { GarantiesFinancières } from '../garantiesFinancières.model';
import { getGarantiesFinancièresProjector } from '../garantiesFinancières.projector';
import { Project } from '../../project/project.model';

export default getGarantiesFinancièresProjector().on(
  ProjectAbandoned,
  async (évènement, transaction) => {
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
  },
);
