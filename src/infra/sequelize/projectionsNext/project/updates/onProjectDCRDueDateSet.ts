import { logger } from '@core/utils';
import { ProjectDCRDueDateSet } from '@modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectDCRDueDateSet = ProjectProjector.on(
  ProjectDCRDueDateSet,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, dcrDueOn },
      } = évènement;

      await Project.update(
        {
          dcrDueOn,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectDCRDueDateSet`,
          {
            évènement,
            nomProjection: 'Project.ProjectDCRDueDateSet',
          },
          error,
        ),
      );
    }
  },
);

// export const onProjectDCRDueDateSet = (models) => async (event: ProjectDCRDueDateSet) => {
//   const ProjectModel = models.Project;
//   const projectInstance = await ProjectModel.findByPk(event.payload.projectId);

//   if (!projectInstance) {
//     logger.error(
//       `Error: onProjectDCRDueDateSet projection failed to retrieve project from db': ${event}`,
//     );
//     return;
//   }

//   // update dcrDueOn
//   projectInstance.dcrDueOn = event.payload.dcrDueOn;

//   try {
//     await projectInstance.save();
//   } catch (e) {
//     logger.error(e);
//     logger.info('Error: onProjectDCRDueDateSet projection failed to update project', event);
//   }
// };
