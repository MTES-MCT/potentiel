import { logger } from '../../../../../core/utils';
import {
  LegacyModificationDTO,
  LegacyModificationImported,
} from '../../../../../modules/modificationRequest';
import { ModificationRequest } from '../modificationRequest.model';
import { ModificationRequestProjector } from '../modificationRequest.projector';
import { ProjectionEnEchec } from '../../../../../modules/shared';

export const onLegacyModificationImported = ModificationRequestProjector.on(
  LegacyModificationImported,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, modifications },
        occurredAt,
      } = évènement;

      await ModificationRequest.destroy({ where: { projectId, isLegacy: true } });

      const modificationRequests = modifications.map((modificationRequest) => {
        const acceptanceParams = getAcceptanceParams(modificationRequest);

        const { modificationId, type, modifiedOn, filename, status } = modificationRequest;

        return {
          id: modificationId,
          type,
          respondedOn: modifiedOn,
          requestedOn: modifiedOn,
          projectId,
          versionDate: occurredAt,
          isLegacy: true,
          filename,
          status,
          acceptanceParams,
        };
      });

      await ModificationRequest.bulkCreate(modificationRequests, { transaction });
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement LegacyModificationImported`,
          {
            évènement,
            nomProjection: 'ModificationRequest.LegacyModificationImported',
          },
          error,
        ),
      );
    }
  },
);

const getAcceptanceParams = (
  modification: LegacyModificationDTO,
): Record<string, string | number> => {
  if (modification.type === 'actionnaire') {
    return {
      actionnairePrecedent: modification.actionnairePrecedent,
      siretPrecedent: modification.siretPrecedent,
    };
  } else if (modification.type === 'delai' && modification.status === 'acceptée') {
    return {
      nouvelleDateLimiteAchevement: modification.nouvelleDateLimiteAchevement,
      ancienneDateLimiteAchevement: modification.ancienneDateLimiteAchevement,
    };
  } else if (modification.type === 'producteur') {
    return {
      producteurPrecedent: modification.producteurPrecedent,
    };
  } else if (modification.type === 'recours') {
    return {
      motifElimination: modification.motifElimination,
    };
  }

  return {};
};
