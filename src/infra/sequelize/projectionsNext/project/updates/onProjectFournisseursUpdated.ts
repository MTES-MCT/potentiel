import { logger } from '@core/utils';
import { ProjectFournisseursUpdated } from '@modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

// TODO: Projection migrée en l'état, doit être revu (en supprimant l'utilisation de la colonne JSON)
export const onProjectFournisseursUpdated = ProjectProjector.on(
  ProjectFournisseursUpdated,
  async (évènement, transaction) => {
    try {
      const { projectId, newFournisseurs, newEvaluationCarbone } = évènement.payload;
      const projectInstance = await Project.findByPk(projectId);

      if (!projectInstance) {
        logger.error(
          `Error: onProjectFournisseursUpdated projection failed to retrieve project from db: ${event}`,
        );
        return;
      }

      const newProjectDetails = newFournisseurs.reduce((prev, { kind, name }) => {
        return {
          ...prev,
          [kind]: name,
        };
      }, {});

      projectInstance.details = {
        ...projectInstance.details,
        ...newProjectDetails,
      };

      if (newEvaluationCarbone) projectInstance.evaluationCarbone = newEvaluationCarbone;
      projectInstance.changed('details', true);

      await projectInstance.save();
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectFournisseursUpdated`,
          {
            évènement,
            nomProjection: 'Project.ProjectFournisseursUpdated',
          },
          error,
        ),
      );
    }
  },
);
