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
          versionDate: occurredAt,
          responseFileId: fichierRéponseId,
          dateAchèvementAprèsCorrectionDélaiAccordé: new Date(dateAchèvementAccordée).toISOString(),
          délaiAccordéCorrigéLe: new Date(occurredAt).toISOString(),
          délaiAccordéCorrigéPar: corrigéPar,
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
