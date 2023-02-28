import { logger } from '@core/utils';
import { ModificationRequest, ModificationRequestProjector } from '@infra/sequelize';
import { AbandonAnnulé } from '@modules/demandeModification';
import { ProjectionEnEchec } from '@modules/shared';

export default ModificationRequestProjector.on(AbandonAnnulé, async (évènement, transaction) => {
  const {
    payload: { demandeAbandonId, annuléPar },
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
      where: { id: demandeAbandonId },
      transaction,
    },
  );
  try {
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement AbandonAnnulé`,
        {
          évènement,
          nomProjection: 'ModificationRequest.AbandonAnnulé',
        },
        error,
      ),
    );
  }
});
