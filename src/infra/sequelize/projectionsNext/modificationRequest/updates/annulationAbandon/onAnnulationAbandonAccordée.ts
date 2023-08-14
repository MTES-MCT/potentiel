import { logger } from '../../../../../../core/utils';
import { ModificationRequest } from '../../modificationRequest.model';
import { ModificationRequestProjector } from '../../modificationRequest.projector';
import { AnnulationAbandonAccordée } from '../../../../../../modules/demandeModification';
import { ProjectionEnEchec } from '../../../../../../modules/shared';

export const onAnnulationAbandonAccordée = ModificationRequestProjector.on(
  AnnulationAbandonAccordée,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeId, accordéPar, fichierRéponseId },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'acceptée',
          respondedBy: accordéPar,
          respondedOn: occurredAt.getTime(),
          versionDate: occurredAt,
          responseFileId: fichierRéponseId,
        },
        { where: { id: demandeId }, transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement AnnulationAbandonAccordée`,
          {
            évènement,
            nomProjection: 'ModificationRequest.AnnulationAbandonAccordée',
          },
          error,
        ),
      );
    }
  },
);
