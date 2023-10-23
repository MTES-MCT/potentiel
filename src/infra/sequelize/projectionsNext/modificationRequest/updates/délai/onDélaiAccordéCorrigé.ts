import { logger } from '../../../../../../core/utils';
import { ProjectionEnEchec } from '../../../../../../modules/shared';
import { DélaiAccordéCorrigé } from '../../../../../../modules/demandeModification';
import { ModificationRequest } from '../../modificationRequest.model';
import { ModificationRequestProjector } from '../../modificationRequest.projector';

export const onDélaiAccordéCorrigé = ModificationRequestProjector.on(
  DélaiAccordéCorrigé,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeDélaiId, dateAchèvementAccordée, fichierRéponseId, corrigéPar },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'acceptée',
          respondedOn: occurredAt.getTime(),
          respondedBy: corrigéPar,
          versionDate: occurredAt,
          responseFileId: fichierRéponseId,
          acceptanceParams: {
            dateAchèvementAccordée: dateAchèvementAccordée,
          },
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
          `Erreur lors du traitement de l'évènement DélaiAccordéCorrigé`,
          {
            évènement,
            nomProjection: 'ModificationRequest.DélaiAccordéCorrigé',
          },
          error,
        ),
      );
    }
  },
);
