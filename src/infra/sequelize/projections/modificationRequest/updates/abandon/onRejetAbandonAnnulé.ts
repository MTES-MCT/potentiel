import { logger } from '@core/utils';
import { RejetAbandonAnnulé } from '@modules/demandeModification';
import { ProjectionEnEchec } from '../../../../../../modules/shared';

export const onRejetAbandonAnnulé = (models) => async (évènement: RejetAbandonAnnulé) => {
  const { payload, occurredAt } = évènement;
  const { demandeAbandonId } = payload;
  try {
    const ModificationRequestModel = models.ModificationRequest;

    await ModificationRequestModel.update(
      {
        status: 'envoyée',
        respondedBy: null,
        respondedOn: null,
        responseFileId: null,
        versionDate: occurredAt,
      },
      {
        where: {
          id: demandeAbandonId,
        },
      },
    );
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors de la projection de la demande d'abandon`,
        {
          évènement,
          nomProjection: 'onRejetAbandonAnnulé',
        },
        e,
      ),
    );
  }
};
