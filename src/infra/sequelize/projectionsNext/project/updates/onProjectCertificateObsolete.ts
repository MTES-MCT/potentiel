import { logger } from '@core/utils';
import { ProjectCertificateObsolete } from '@modules/project';
import { ProjectProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onProjectCertificateObsolete = ProjectProjector.on(
  ProjectCertificateObsolete,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectCertificateObsolete`,
          {
            évènement,
            nomProjection: 'Project.ProjectCertificateObsolete',
          },
          error,
        ),
      );
    }
  },
);

// export const onProjectCertificateObsolete =
//   (models) => async (event: ProjectCertificateObsolete) => {
//     const { Project } = models;
//     const projectInstance = await Project.findByPk(event.payload.projectId);

//     if (!projectInstance) {
//       logger.error(
//         `Error: onProjectCertificateObsolete projection failed to retrieve project from db' ${event}`,
//       );
//       return;
//     }

//     projectInstance.certificateFileId = null;

//     try {
//       await projectInstance.save();
//     } catch (e) {
//       logger.error(e);
//       logger.info('Error: onProjectCertificateObsolete projection failed to update project', event);
//     }
//   };
