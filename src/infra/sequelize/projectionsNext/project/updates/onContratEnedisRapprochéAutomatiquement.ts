import { logger } from '@core/utils';
import { ContratEnedisRapprochéAutomatiquement } from '@modules/enedis';
import { Project, ProjectProjector } from '../project.model';
import { ProjectionEnEchec } from '@modules/shared';

// TODO: Projection migrée en l'état, mais pose probléme car le design de la gestion des contrats doit être revu (en supprimant l'utilisation de la colonne JSON)
export const onContratEnedisRapprochéAutomatiquement = ProjectProjector.on(
  ContratEnedisRapprochéAutomatiquement,
  async (évènement, transaction) => {
    try {
      const { projectId, numero } = évènement.payload;
      const projectInstance = await Project.findByPk(projectId);

      if (!projectInstance) {
        logger.error(
          `Error: onEnedisContractAutomaticallyLinkedToProject projection failed to retrieve project from db: ${event}`,
        );
        return;
      }

      projectInstance.contratEnedis = {
        numero,
      };

      await projectInstance.save();
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ContratEnedisRapprochéAutomatiquement`,
          {
            évènement,
            nomProjection: 'Project.ContratEnedisRapprochéAutomatiquement',
          },
          error,
        ),
      );
    }
  },
);
