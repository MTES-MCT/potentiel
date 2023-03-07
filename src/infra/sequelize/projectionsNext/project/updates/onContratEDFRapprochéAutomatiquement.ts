import { logger } from '@core/utils';
import { ContratEDFRapprochéAutomatiquement } from '@modules/edf';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '@modules/shared';

// TODO: Projection migrée en l'état, mais pose probléme car le design de la gestion des contrats doit être revu (en supprimant l'utilisation de la colonne JSON)
export const onContratEDFRapprochéAutomatiquement = ProjectProjector.on(
  ContratEDFRapprochéAutomatiquement,
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
          `Error: onEDFContractAutomaticallyLinkedToProject projection failed to retrieve project from db: ${event}`,
        );
        return;
      }

      projectInstance.contratEDF = {
        numero,
        type,
        dateEffet,
        dateSignature,
        dateMiseEnService,
        statut,
        duree: duree && Number(duree),
      } as any;

      await projectInstance.save();
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ContratEDFRapprochéAutomatiquement`,
          {
            évènement,
            nomProjection: 'Project.ContratEDFRapprochéAutomatiquement',
          },
          error,
        ),
      );
    }
  },
);
