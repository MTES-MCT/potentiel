import { logger } from '@core/utils';
import { ProjectCertificateRegenerated } from '@modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectCertificateRegenerated = ProjectProjector.on(
  ProjectCertificateRegenerated,
  async (évènement, transaction) => {
    try {
      const {
        payload: { certificateFileId, projectId },
      } = évènement;
      await Project.update(
        {
          certificateFileId,
        },
        {
          where: { id: projectId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectCertificateRegenerated`,
          {
            évènement,
            nomProjection: 'Project.ProjectCertificateRegenerated',
          },
          error,
        ),
      );
    }
  },
);

// export const onProjectCertificateGenerated =
//   (models) =>
//   async (
//     event: ProjectCertificateGenerated,
//   ) => {
//     const ProjectModel = models.Project;
//     const projectInstance = await ProjectModel.findByPk(event.payload.projectId);

//     if (!projectInstance) {
//       logger.error(
//         `Error: onProjectCertificate projection failed to retrieve project from db' ${event}`,
//       );
//       return;
//     }

//     // update certificateFileId
//     projectInstance.certificateFileId = event.payload.certificateFileId;

//     try {
//       await projectInstance.save();
//     } catch (e) {
//       logger.error(e);
//       logger.info('Error: onProjectCertificate projection failed to update project', event);
//     }
//   };
