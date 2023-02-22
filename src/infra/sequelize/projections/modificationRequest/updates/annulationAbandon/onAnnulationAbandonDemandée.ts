import { logger } from '@core/utils';
import { AnnulationAbandonDemandée } from '@modules/demandeModification/demandeAnnulationAbandon/events';

export const onAnnulationAbandonDemandée =
  (models) =>
  async ({ payload, occurredAt }: AnnulationAbandonDemandée) => {
    const { demandeId, demandéPar, projetId, cahierDesCharges } = payload;
    try {
      const ModificationRequestModel = models.ModificationRequest;

      await ModificationRequestModel.create({
        id: demandeId,
        projectId: projetId,
        type: 'annulation abandon',
        requestedOn: occurredAt.getTime(),
        versionDate: occurredAt,
        status: 'envoyée',
        userId: demandéPar,
        authority: 'dgec',
        cahierDesCharges,
      });
    } catch (e) {
      logger.error(e);
    }
  };
