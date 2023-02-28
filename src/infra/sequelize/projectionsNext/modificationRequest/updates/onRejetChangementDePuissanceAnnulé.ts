import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';
import { RejetChangementDePuissanceAnnulé } from '@modules/demandeModification';
import { ModificationRequestProjector } from '@infra/sequelize';

export default ModificationRequestProjector.on(
  RejetChangementDePuissanceAnnulé,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
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

export const onRejetChangementDePuissanceAnnulé =
  (models) => async (évènement: RejetChangementDePuissanceAnnulé) => {
    const {
      payload: { demandeChangementDePuissanceId },
      occurredAt,
    } = évènement;
    try {
      const ModificationRequestModel = models.ModificationRequest;
      await ModificationRequestModel.update(
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
        },
      );
    } catch (e) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement RejetChangementDePuissanceAnnulé`,
          {
            évènement,
            nomProjection: 'ProjectEventProjector.onRejetChangementDePuissanceAnnulé',
          },
          e,
        ),
      );
    }
  };
