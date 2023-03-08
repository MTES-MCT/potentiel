import { logger } from '@core/utils';
import { ModificationRequest } from '../../modificationRequest.model';
import { ModificationRequestProjector } from '../../modificationRequest.projector';
import { AbandonDemandé } from '@modules/demandeModification';
import { ProjectionEnEchec } from '@modules/shared';

export const onAbandonDemandé = ModificationRequestProjector.on(
  AbandonDemandé,
  async (évènement, transaction) => {
    try {
      const {
        payload: {
          demandeAbandonId,
          projetId,
          fichierId,
          justification,
          autorité,
          porteurId,
          cahierDesCharges,
        },
        occurredAt,
      } = évènement;

      await ModificationRequest.create(
        {
          id: demandeAbandonId,
          projectId: projetId,
          type: 'abandon',
          requestedOn: occurredAt.getTime(),
          versionDate: occurredAt,
          status: 'envoyée',
          fileId: fichierId,
          userId: porteurId,
          justification,
          authority: autorité,
          cahierDesCharges,
        },
        {
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement AbandonDemandé`,
          {
            évènement,
            nomProjection: 'ModificationRequest.AbandonDemandé',
          },
          error,
        ),
      );
    }
  },
);
