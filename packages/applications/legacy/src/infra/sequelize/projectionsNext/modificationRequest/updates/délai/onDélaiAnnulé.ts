import { logger } from '../../../../../../core/utils';
import { ProjectionEnEchec } from '../../../../../../modules/shared';
import { DélaiAnnulé } from '../../../../../../modules/demandeModification';
import { ModificationRequest } from '../../modificationRequest.model';
import { ModificationRequestProjector } from '../../modificationRequest.projector';

export const onDélaiAnnulé = ModificationRequestProjector.on(
  DélaiAnnulé,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeDélaiId, annuléPar },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'annulée',
          cancelledBy: annuléPar,
          cancelledOn: occurredAt.getTime(),
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
          `Erreur lors du traitement de l'évènement DélaiAnnulé`,
          {
            évènement,
            nomProjection: 'ModificationRequest.DélaiAnnulé',
          },
          error,
        ),
      );
    }
  },
);
