import { logger } from '@core/utils';
import { AnnulationAbandonDemandée } from '@modules/demandeModification';
import { ModificationRequest, ModificationRequestProjector } from '../../modificationRequest.model';
import { ProjectionEnEchec } from '@modules/shared';

export const onAnnulationAbandonDemandée = ModificationRequestProjector.on(
  AnnulationAbandonDemandée,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeId, demandéPar, projetId, cahierDesCharges },
        occurredAt,
      } = évènement;

      await ModificationRequest.create(
        {
          id: demandeId,
          projectId: projetId,
          type: 'annulation abandon',
          requestedOn: occurredAt.getTime(),
          versionDate: occurredAt,
          status: 'envoyée',
          userId: demandéPar,
          authority: 'dgec',
          cahierDesCharges,
        },
        {
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement AnnulationAbandonDemandée`,
          {
            évènement,
            nomProjection: 'ModificationRequest.AnnulationAbandonDemandée',
          },
          error,
        ),
      );
    }
  },
);
