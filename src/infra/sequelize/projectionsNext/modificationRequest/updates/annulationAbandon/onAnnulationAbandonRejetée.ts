import { logger } from '@core/utils';
import { AnnulationAbandonRejetée } from '@modules/demandeModification';
import { ModificationRequest, ModificationRequestProjector } from '@infra/sequelize';
import { ProjectionEnEchec } from '@modules/shared';

export default ModificationRequestProjector.on(
  AnnulationAbandonRejetée,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeId, rejetéPar, fichierRéponseId },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'rejetée',
          respondedOn: occurredAt.getTime(),
          respondedBy: rejetéPar,
          versionDate: occurredAt,
          responseFileId: fichierRéponseId,
        },
        { where: { id: demandeId }, transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement AnnulationAbandonRejetée`,
          {
            évènement,
            nomProjection: 'ModificationRequest.AnnulationAbandonRejetée',
          },
          error,
        ),
      );
    }
  },
);
