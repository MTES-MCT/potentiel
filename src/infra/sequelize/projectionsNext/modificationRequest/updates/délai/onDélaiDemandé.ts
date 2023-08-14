import { logger } from '../../../../../../core/utils';
import { ProjectionEnEchec } from '../../../../../../modules/shared';
import { DélaiDemandé } from '../../../../../../modules/demandeModification';
import { ModificationRequest } from '../../modificationRequest.model';
import { ModificationRequestProjector } from '../../modificationRequest.projector';

export const onDélaiDemandé = ModificationRequestProjector.on(
  DélaiDemandé,
  async (évènement, transaction) => {
    try {
      const {
        payload: {
          demandeDélaiId,
          projetId,
          fichierId,
          justification,
          autorité,
          dateAchèvementDemandée,
          porteurId,
          cahierDesCharges,
        },
        occurredAt,
      } = évènement;

      await ModificationRequest.create(
        {
          id: demandeDélaiId,
          projectId: projetId,
          type: 'delai',
          requestedOn: occurredAt.getTime(),
          versionDate: occurredAt,
          status: 'envoyée',
          fileId: fichierId,
          userId: porteurId,
          justification,
          authority: autorité,
          dateAchèvementDemandée,
          cahierDesCharges,
        },
        { transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement DélaiDemandé`,
          {
            évènement,
            nomProjection: 'ModificationRequest.DélaiDemandé',
          },
          error,
        ),
      );
    }
  },
);
