import { logger } from '@core/utils';
import { ContratEnedisMisAJour } from '@modules/enedis';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

// TODO: Projection migrée en l'état, mais pose probléme car le design de la gestion des contrats doit être revu (en supprimant l'utilisation de la colonne JSON)
export const onContratEnedisMisAJour = ProjectProjector.on(
  ContratEnedisMisAJour,
  async (évènement, transaction) => {
    try {
      const { projectId, numero } = évènement.payload;
      const projectInstance = await Project.findByPk(projectId);

      if (!projectInstance) {
        logger.error(
          `Error: onContratEnedisMisAJour projection failed to retrieve project from db: ${event}`,
        );
        return;
      }

      projectInstance.contratEnedis = {
        ...projectInstance.contratEnedis,
        numero,
      };
      projectInstance.changed('contratEnedis', true);
      await projectInstance.save();
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ContratEnedisMisAJour`,
          {
            évènement,
            nomProjection: 'Project.ContratEnedisMisAJour',
          },
          error,
        ),
      );
    }
  },
);
