import { logger } from '@core/utils';
import { LegacyProjectSourced } from '@modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

export const onLegacyProjectSourced = ProjectProjector.on(
  LegacyProjectSourced,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, content, potentielIdentifier },
      } = évènement;
      await Project.create(
        {
          id: projectId,
          ...content,
          evaluationCarboneDeRéférence: content.evaluationCarbone,
          potentielIdentifier,
        } as any,
        { transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement LegacyProjectSourced`,
          {
            évènement,
            nomProjection: 'Project.LegacyProjectSourced',
          },
          error,
        ),
      );
    }
  },
);
