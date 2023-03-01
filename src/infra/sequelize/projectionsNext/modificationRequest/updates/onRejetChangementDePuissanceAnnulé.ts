import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';
import { RejetChangementDePuissanceAnnulé } from '@modules/demandeModification';
import { ModificationRequest, ModificationRequestProjector } from '../modificationRequest.model';

export const onRejetChangementDePuissanceAnnulé = ModificationRequestProjector.on(
  RejetChangementDePuissanceAnnulé,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeChangementDePuissanceId },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'envoyée',
          respondedBy: null,
          respondedOn: null,
          responseFileId: null,
          versionDate: occurredAt,
        },
        {
          where: {
            id: demandeChangementDePuissanceId,
          },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement RejetChangementDePuissanceAnnulé`,
          {
            évènement,
            nomProjection: 'ModificationRequest.RejetChangementDePuissanceAnnulé',
          },
          error,
        ),
      );
    }
  },
);
