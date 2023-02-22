import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';
import { RejetChangementDePuissanceAnnulé } from '@modules/demandeModification';
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model';

export default ProjectEventProjector.on(
  RejetChangementDePuissanceAnnulé,
  async (évènement, transaction) => {
    const {
      payload: { demandeChangementDePuissanceId },
    } = évènement;

    try {
      await ProjectEvent.destroy({
        where: {
          type: 'ModificationRequestRejected',
          'payload.modificationRequestId': demandeChangementDePuissanceId,
        },
        transaction,
      });
      await ProjectEvent.destroy({
        where: {
          type: 'ModificationRequestInstructionStarted',
          'payload.modificationRequestId': demandeChangementDePuissanceId,
        },
        transaction,
      });
    } catch (e) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement RejetChangementDePuissanceAnnulé`,
          {
            évènement,
            nomProjection: 'ProjectEventProjector.onRejetChangementDePuissanceAnnulé',
          },
        ),
      );
    }
  },
);
