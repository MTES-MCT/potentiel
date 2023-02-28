import { logger } from '@core/utils';
import { LegacyModificationImported } from '@modules/modificationRequest';
import { ModificationRequest, ModificationRequestProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export const onLegacyModificationImported = ModificationRequestProjector.on(
  LegacyModificationImported,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, modifications },
        occurredAt,
      } = évènement;

      await ModificationRequest.destroy({ where: { projectId, isLegacy: true } });

      for (const modification of modifications) {
        const common = {
          id: modification.modificationId,
          type: modification.type,
          respondedOn: modification.modifiedOn,
          requestedOn: modification.modifiedOn,
          projectId,
          versionDate: occurredAt,
          isLegacy: true,
          filename: modification.filename,
          status: modification.status,
        };
        switch (modification.type) {
          case 'abandon':
            await ModificationRequest.create(
              {
                ...common,
              },
              { transaction },
            );
            break;
          case 'actionnaire':
            await ModificationRequest.create(
              {
                ...common,
                acceptanceParams: {
                  actionnairePrecedent: modification.actionnairePrecedent,
                  siretPrecedent: modification.siretPrecedent,
                },
              },
              { transaction },
            );
            break;
          case 'delai':
            if (modification.status === 'acceptée') {
              await ModificationRequest.create(
                {
                  ...common,
                  acceptanceParams: {
                    nouvelleDateLimiteAchevement: modification.nouvelleDateLimiteAchevement,
                    ancienneDateLimiteAchevement: modification.ancienneDateLimiteAchevement,
                  },
                },
                { transaction },
              );
            } else {
              await ModificationRequest.create({
                ...common,
              });
            }
            break;
          case 'producteur':
            await ModificationRequest.create(
              {
                ...common,
                acceptanceParams: {
                  producteurPrecedent: modification.producteurPrecedent,
                },
              },
              { transaction },
            );
            break;
          case 'recours':
            await ModificationRequest.create(
              {
                ...common,
                acceptanceParams: {
                  motifElimination: modification.motifElimination,
                },
              },
              { transaction },
            );
            break;
        }
      }
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
