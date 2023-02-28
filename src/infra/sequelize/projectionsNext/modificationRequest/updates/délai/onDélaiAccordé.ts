import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';
import { DélaiAccordé } from '@modules/demandeModification';

export const onDélaiAccordé = (models) => async (évènement: DélaiAccordé) => {
  const {
    payload: { demandeDélaiId, dateAchèvementAccordée, fichierRéponseId, accordéPar },
    occurredAt,
  } = évènement;
  try {
    const ModificationRequestModel = models.ModificationRequest;

    await ModificationRequestModel.update(
      {
        status: 'acceptée',
        respondedOn: occurredAt.getTime(),
        respondedBy: accordéPar,
        versionDate: occurredAt,
        responseFileId: fichierRéponseId,
        acceptanceParams: {
          dateAchèvementAccordée,
        },
      },
      {
        where: {
          id: demandeDélaiId,
        },
      },
    );
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(`Erreur lors du traitement de l'évènement DélaiAccordé`, {
        nomProjection: 'ProjectEventProjector.onDélaiAccordé',
        évènement,
      }),
    );
  }
};
