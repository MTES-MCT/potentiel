import { logger } from '@core/utils';
import { RejetRecoursAnnulé } from '@modules/demandeModification';
import { ModificationRequestProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export default ModificationRequestProjector.on(
  RejetRecoursAnnulé,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement RejetRecoursAnnulé`,
          {
            évènement,
            nomProjection: 'ModificationRequest.RejetRecoursAnnulé',
          },
          error,
        ),
      );
    }
  },
);

export const onRejetRecoursAnnulé =
  (models) =>
  async ({ payload, occurredAt }: RejetRecoursAnnulé) => {
    const { demandeRecoursId } = payload;
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
            id: demandeRecoursId,
          },
        },
      );
    } catch (e) {
      logger.error(e);
    }
  };
