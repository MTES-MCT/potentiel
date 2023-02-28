import { logger } from '@core/utils';
import { ModificationRequest, ModificationRequestProjector } from '@infra/sequelize';
import { AnnulationAbandonAnnulée } from '@modules/demandeModification';
import { ProjectionEnEchec } from '@modules/shared';

export default ModificationRequestProjector.on(
  AnnulationAbandonAnnulée,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeId, annuléePar },
        occurredAt,
      } = évènement;
      await ModificationRequest.update(
        {
          status: 'annulée',
          cancelledBy: annuléePar,
          cancelledOn: occurredAt.getTime(),
          versionDate: occurredAt,
        },
        { where: { id: demandeId }, transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement AnnulationAbandonAnnulée`,
          {
            évènement,
            nomProjection: 'ModificaitonRequest.AnnulationAbandonAnnulée',
          },
          error,
        ),
      );
    }
  },
);
