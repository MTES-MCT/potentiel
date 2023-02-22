import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';
import { DélaiRejeté } from '@modules/demandeModification';

export const onDélaiRejeté = (models) => async (évènement: DélaiRejeté) => {
  const {
    payload: { demandeDélaiId, rejetéPar, fichierRéponseId },
    occurredAt,
  } = évènement;
  try {
    const ModificationRequestModel = models.ModificationRequest;

    await ModificationRequestModel.update(
      {
        status: 'rejetée',
        respondedBy: rejetéPar,
        respondedOn: occurredAt.getTime(),
        versionDate: occurredAt,
        responseFileId: fichierRéponseId,
      },
      {
        where: {
          id: demandeDélaiId,
        },
      },
    );
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(`Erreur lors du traitement de l'évènement DélaiRejeté`, {
        nomProjection: 'ProjectEventProjector.onDélaiRejeté',
        évènement,
      }),
    );
  }
};
