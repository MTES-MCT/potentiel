import { logger } from '@core/utils';
import { ContratEDFMisAJour } from '@modules/edf';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

// TODO: Projection migrée en l'état, mais pose probléme car le design de la gestion des contrats doit être revu (en supprimant l'utilisation de la colonne JSON)
export const onContratEDFMisAJour = ProjectProjector.on(
  ContratEDFMisAJour,
  async (évènement, transaction) => {
    try {
      const {
        projectId,
        numero,
        type,
        dateEffet,
        dateSignature,
        dateMiseEnService,
        statut,
        duree,
      } = évènement.payload;
      const projectInstance = await Project.findByPk(projectId);

      if (!projectInstance) {
        logger.error(
          `Error: onContratEDFMisAJour projection failed to retrieve project from db: ${event}`,
        );
        return;
      }

      Object.assign(projectInstance.contratEDF as any, {
        numero,
        ...(type ? { type } : undefined),
        ...(dateEffet ? { dateEffet } : undefined),
        ...(dateSignature ? { dateSignature } : undefined),
        ...(dateMiseEnService ? { dateMiseEnService } : undefined),
        ...(statut ? { statut } : undefined),
        ...(duree ? { duree: Number(duree) } : undefined),
      });
      projectInstance.changed('contratEDF', true);
      await projectInstance.save();
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ContratEDFMisAJour`,
          {
            évènement,
            nomProjection: 'Project.ContratEDFMisAJour',
          },
          error,
        ),
      );
    }
  },
);
