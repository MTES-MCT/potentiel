import { logger } from '@core/utils';
import { ProjectReimported } from '@modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

// TODO: Projection migrée en l'état, doit être revu (en supprimant l'utilisation de la colonne JSON)
export const onProjectReimported = ProjectProjector.on(
  ProjectReimported,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, data },
      } = évènement;
      const project = await Project.findByPk(projectId);

      if (project === null) {
        throw new Error(`onProjectReimported for project that is not found ${projectId}`);
      }

      const { details, ...other } = data;

      if (details) {
        Object.assign(project.details as any, details);
        project.changed('details', true);
      }

      Object.assign(project, {
        ...other,
        evaluationCarboneDeRéférence:
          other.evaluationCarbone ?? project.evaluationCarboneDeRéférence,
      });

      await project.save();
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectReimported`,
          {
            évènement,
            nomProjection: 'Project.ProjectReimported',
          },
          error,
        ),
      );
    }
  },
);
