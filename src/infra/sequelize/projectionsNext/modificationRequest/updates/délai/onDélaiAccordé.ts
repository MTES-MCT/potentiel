import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';
import { DélaiAccordé } from '@modules/demandeModification';
import { ModificationRequest, ModificationRequestProjector } from '../../modificationRequest.model';

export const onDélaiAccordé = ModificationRequestProjector.on(
  DélaiAccordé,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeDélaiId, dateAchèvementAccordée, fichierRéponseId, accordéPar },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'acceptée',
          respondedOn: occurredAt.getTime(),
          respondedBy: accordéPar,
          versionDate: occurredAt,
          responseFileId: fichierRéponseId,
          acceptanceParams: {
            dateAchèvementAccordée: dateAchèvementAccordée as any, // TODO: dateAchèvementAccordée était initialement dans l'ancienne projection typé en any... mais cela correspond à priori à un bug déjà remonté dans le projet. A fix dans une prochaine PR
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
          `Erreur lors du traitement de l'évènement DélaiAccordé`,
          {
            évènement,
            nomProjection: 'ModificationRequest.DélaiAccordé',
          },
          error,
        ),
      );
    }
  },
);
