import { logger } from '@core/utils';
import { ModificationRequest, ModificationRequestProjector } from '@infra/sequelize';
import { RejetAbandonAnnulé } from '@modules/demandeModification';
import { ProjectionEnEchec } from '../../../../../../modules/shared';

export default ModificationRequestProjector.on(
  RejetAbandonAnnulé,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeAbandonId },
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
            id: demandeAbandonId,
          },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement RejetAbandonAnnulé`,
          {
            évènement,
            nomProjection: 'ModificationRequest.RejetAbandonAnnulé',
          },
          error,
        ),
      );
    }
  },
);
