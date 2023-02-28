import { logger } from '@core/utils';
import { ModificationRequested } from '@modules/modificationRequest';
import { ModificationRequestProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export default ModificationRequestProjector.on(
  ModificationRequested,
  async (évènement, transaction) => {
    try {
      const {} = évènement;
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ModificationRequested`,
          {
            évènement,
            nomProjection: 'ModificationRequest.ModificationRequested',
          },
          error,
        ),
      );
    }
  },
);

export const onModificationRequested =
  (models) =>
  async ({ payload, occurredAt }: ModificationRequested) => {
    const ModificationRequestModel = models.ModificationRequest;

    const {
      modificationRequestId,
      type,
      projectId,
      fileId,
      justification,
      requestedBy,
      authority,
      cahierDesCharges,
    } = payload;
    try {
      await ModificationRequestModel.create({
        id: modificationRequestId,
        projectId,
        type,
        requestedOn: occurredAt.getTime(),
        versionDate: occurredAt,
        status: 'envoyée',
        fileId,
        userId: requestedBy,
        justification,
        puissance: type === 'puissance' ? payload.puissance : undefined,
        puissanceAuMomentDuDepot:
          type === 'puissance' ? payload.puissanceAuMomentDuDepot : undefined,
        delayInMonths: type === 'delai' ? payload.delayInMonths : undefined,
        actionnaire: type === 'actionnaire' ? payload.actionnaire : undefined,
        authority,
        cahierDesCharges,
      });
    } catch (e) {
      logger.error(e);
    }
  };
