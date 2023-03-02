import { logger } from '@core/utils';
import { ProjectFournisseursUpdated } from '@modules/project';
import { ProjectProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectFournisseursUpdated = ProjectProjector.on(
  ProjectFournisseursUpdated,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
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

// export const onProjectFournisseursUpdated =
//   (models) => async (event: ProjectFournisseursUpdated) => {
//     const { projectId, newFournisseurs, newEvaluationCarbone } = event.payload;
//     const { Project } = models;
//     const projectInstance = await Project.findByPk(projectId);

//     if (!projectInstance) {
//       logger.error(
//         `Error: onProjectFournisseursUpdated projection failed to retrieve project from db: ${event}`,
//       );
//       return;
//     }

//     const newProjectDetails = newFournisseurs.reduce((prev, { kind, name }) => {
//       return {
//         ...prev,
//         [kind]: name,
//       };
//     }, {});

//     projectInstance.details = {
//       ...projectInstance.details,
//       ...newProjectDetails,
//     };

//     if (newEvaluationCarbone) projectInstance.evaluationCarbone = newEvaluationCarbone;
//     projectInstance.changed('details', true);

//     try {
//       await projectInstance.save();
//     } catch (e) {
//       logger.error(e);
//       logger.info('Error: onProjectFournisseursUpdated projection failed to update project', event);
//     }
//   };
