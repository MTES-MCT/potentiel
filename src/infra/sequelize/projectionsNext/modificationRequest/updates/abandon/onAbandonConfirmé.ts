import { logger } from '@core/utils';
import { ModificationRequest, ModificationRequestProjector } from '@infra/sequelize';
import { AbandonConfirmé } from '@modules/demandeModification';
import { ProjectionEnEchec } from '@modules/shared';

export default ModificationRequestProjector.on(AbandonConfirmé, async (évènement, transaction) => {
  const {
    payload: { demandeAbandonId, confirméPar },
    occurredAt,
  } = évènement;

  try {
    await ModificationRequest.update(
      {
        status: 'demande confirmée',
        confirmedBy: confirméPar,
        confirmedOn: occurredAt.getTime(),
        versionDate: occurredAt,
      },
      {
        where: { id: demandeAbandonId },
        transaction,
      },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement AbandonConfirmé`,
        {
          évènement,
          nomProjection: 'ModificationRequest.AbandonConfirmé',
        },
        error,
      ),
    );
  }
});
