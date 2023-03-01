import { logger } from '@core/utils';
import { ModificationReceived } from '@modules/modificationRequest';
import { ModificationRequest, ModificationRequestProjector } from '../modificationRequest.model';
import { ProjectionEnEchec } from '@modules/shared';

export const onModificationReceived = ModificationRequestProjector.on(
  ModificationReceived,
  async (évènement, transaction) => {
    try {
      const { payload, occurredAt } = évènement;
      const {
        modificationRequestId,
        projectId,
        requestedBy,
        justification,
        fileId,
        type,
        authority,
        cahierDesCharges,
      } = payload;

      await ModificationRequest.create(
        {
          id: modificationRequestId,
          projectId,
          requestedOn: occurredAt.getTime(),
          versionDate: occurredAt,
          status: 'information validée',
          type,
          userId: requestedBy,
          producteur: type === 'producteur' ? payload.producteur : undefined,
          puissance: type === 'puissance' ? payload.puissance : undefined,
          puissanceAuMomentDuDepot:
            type === 'puissance' ? payload.puissanceAuMomentDuDepot : undefined,
          justification,
          fileId,
          actionnaire: type === 'actionnaire' ? payload.actionnaire : undefined,
          fournisseurs: type === 'fournisseur' ? (payload.fournisseurs as any) : undefined, // TODO: fournisseurs était initialement dans l'ancienne projection typé en any... mais cela correspond à priori à un bug déjà remonté dans le projet. A fix dans une prochaine PR
          evaluationCarbone: type === 'fournisseur' ? payload.evaluationCarbone : undefined,
          authority,
          cahierDesCharges,
        },
        { transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ModificationReceived`,
          {
            évènement,
            nomProjection: 'ModificationRequest.ModificationReceived',
          },
          error,
        ),
      );
    }
  },
);
