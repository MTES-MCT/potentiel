import { logger } from '@core/utils';
import { ModificationRequest, ModificationRequestProjector } from '@infra/sequelize';
import { AbandonDemandé } from '@modules/demandeModification';
import { ProjectionEnEchec } from '@modules/shared';

export default ModificationRequestProjector.on(AbandonDemandé, async (évènement, transaction) => {
  const {
    payload: {
      demandeAbandonId,
      projetId,
      fichierId,
      justification,
      autorité,
      porteurId,
      cahierDesCharges,
    },
    occurredAt,
  } = évènement;

  try {
    await ModificationRequest.create(
      {
        id: demandeAbandonId,
        projectId: projetId,
        type: 'abandon',
        requestedOn: occurredAt.getTime(),
        versionDate: occurredAt,
        status: 'envoyée',
        fileId: fichierId,
        userId: porteurId,
        justification,
        authority: autorité,
        cahierDesCharges,
      },
      {
        transaction,
      },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement AbandonDemandé`,
        {
          évènement,
          nomProjection: 'ModificationRequest.AbandonDemandé',
        },
        error,
      ),
    );
  }
});

export const onAbandonDemandé =
  (models) =>
  async ({ payload, occurredAt }: AbandonDemandé) => {
    const {
      demandeAbandonId,
      projetId,
      fichierId,
      justification,
      autorité,
      porteurId,
      cahierDesCharges,
    } = payload;
    try {
      const ModificationRequestModel = models.ModificationRequest;

      await ModificationRequestModel.create({
        id: demandeAbandonId,
        projectId: projetId,
        type: 'abandon',
        requestedOn: occurredAt.getTime(),
        versionDate: occurredAt,
        status: 'envoyée',
        fileId: fichierId,
        userId: porteurId,
        justification,
        authority: autorité,
        cahierDesCharges,
      });
    } catch (e) {
      logger.error(e);
    }
  };
