import { logger } from '../../../../../core/utils';
import { ProjectFournisseursUpdated } from '../../../../../modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { EntityNotFoundError, ProjectionEnEchec } from '../../../../../modules/shared';

export const onProjectFournisseursUpdated = ProjectProjector.on(
  ProjectFournisseursUpdated,
  async (évènement, transaction) => {
    try {
      const { projectId, newFournisseurs, newEvaluationCarbone } = évènement.payload;
      const projectInstance = await Project.findByPk(projectId, { transaction });

      if (projectInstance === null) {
        throw new EntityNotFoundError();
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

      await projectInstance.save({ transaction });
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
