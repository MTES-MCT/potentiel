import { ProjectAbandoned } from '@modules/project';
import { GarantiesFinancières, GarantiesFinancièresProjector } from '../garantiesFinancières.model';
import models from '../../../models';

export default GarantiesFinancièresProjector.on(
  ProjectAbandoned,
  async (évènement, transaction) => {
    const {
      payload: { projectId: projetId },
    } = évènement;

    const { Project } = models;

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
