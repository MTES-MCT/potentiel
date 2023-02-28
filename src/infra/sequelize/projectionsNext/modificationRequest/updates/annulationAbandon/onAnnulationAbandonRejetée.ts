import { logger } from '@core/utils';
import { AnnulationAbandonRejetée } from '@modules/demandeModification';

export const onAnnulationAbandonRejetée =
  (models) =>
  async ({ payload, occurredAt }: AnnulationAbandonRejetée) => {
    const { demandeId, rejetéPar, fichierRéponseId } = payload;
    try {
      const ModificationRequestModel = models.ModificationRequest;

      await ModificationRequestModel.update(
        {
          status: 'rejetée',
          respondedOn: occurredAt.getTime(),
          respondedBy: rejetéPar,
          versionDate: occurredAt,
          responseFileId: fichierRéponseId,
        },
        { where: { id: demandeId } },
      );
    } catch (e) {
      logger.error(e);
    }
  };
