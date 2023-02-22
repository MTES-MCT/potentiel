import { logger } from '@core/utils';
import { AnnulationAbandonAnnulée } from '@modules/demandeModification';

export const onAnnulationAbandonAnnulée =
  (models) =>
  async ({ payload, occurredAt }: AnnulationAbandonAnnulée) => {
    const { demandeId, annuléePar } = payload;
    try {
      const ModificationRequestModel = models.ModificationRequest;

      await ModificationRequestModel.update(
        {
          status: 'annulée',
          cancelledBy: annuléePar,
          cancelledOn: occurredAt.getTime(),
          versionDate: occurredAt,
        },
        { where: { id: demandeId } },
      );
    } catch (e) {
      logger.error(e);
    }
  };
