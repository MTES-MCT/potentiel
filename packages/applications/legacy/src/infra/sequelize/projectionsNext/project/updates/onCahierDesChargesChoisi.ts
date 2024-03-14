import { CahierDesChargesChoisi } from '../../../../../modules/project';

import { logger } from '../../../../../core/utils';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { formatCahierDesChargesRéférence } from '../../../../../entities/cahierDesCharges';

export const onCahierDesChargesChoisi = ProjectProjector.on(
  CahierDesChargesChoisi,
  async (évènement, transaction) => {
    try {
      const { payload } = évènement;
      await Project.update(
        {
          cahierDesChargesActuel: formatCahierDesChargesRéférence(payload),
        },
        { where: { id: payload.projetId }, transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement OnCahierDesChargesChoisi`,
          {
            évènement,
            nomProjection: 'Project.OnCahierDesChargesChoisi',
          },
          error,
        ),
      );
    }
  },
);
