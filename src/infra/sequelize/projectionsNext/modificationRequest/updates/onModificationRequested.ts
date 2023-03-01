import { logger } from '@core/utils';
import { ModificationRequested } from '@modules/modificationRequest';
import { ModificationRequest, ModificationRequestProjector } from '../modificationRequest.model';
import { ProjectionEnEchec } from '@modules/shared';

export const onModificationRequested = ModificationRequestProjector.on(
  ModificationRequested,
  async (évènement, transaction) => {
    try {
      const { payload, occurredAt } = évènement;
      const {
        modificationRequestId,
        type,
        projectId,
        fileId,
        justification,
        requestedBy,
        authority,
        cahierDesCharges,
      } = payload;

      await ModificationRequest.create(
        {
          id: modificationRequestId,
          projectId,
          type,
          requestedOn: occurredAt.getTime(),
          versionDate: occurredAt,
          status: 'envoyée',
          fileId,
          userId: requestedBy,
          justification,
          puissance: type === 'puissance' ? payload.puissance : undefined,
          puissanceAuMomentDuDepot:
            type === 'puissance' ? payload.puissanceAuMomentDuDepot : undefined,
          delayInMonths: type === 'delai' ? payload.delayInMonths : undefined,
          actionnaire: type === 'actionnaire' ? payload.actionnaire : undefined,
          authority,
          cahierDesCharges,
        },
        { transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ModificationRequested`,
          {
            évènement,
            nomProjection: 'ModificationRequest.ModificationRequested',
          },
          error,
        ),
      );
    }
  },
);
