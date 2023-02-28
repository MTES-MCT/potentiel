import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';
import { RejetDélaiAnnulé } from '@modules/demandeModification';
import { ModificationRequest, ModificationRequestProjector } from '@infra/sequelize';

export const onRejetDélaiAnnulé = ModificationRequestProjector.on(
  RejetDélaiAnnulé,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeDélaiId },
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
            id: demandeDélaiId,
          },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement RejetDélaiAnnulé`,
          {
            évènement,
            nomProjection: 'ModificationRequest.RejetDélaiAnnulé',
          },
          error,
        ),
      );
    }
  },
);
