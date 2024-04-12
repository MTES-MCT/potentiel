import { logger } from '../../../../../core/utils';
import { RejetRecoursAnnulé } from '../../../../../modules/demandeModification';
import { ModificationRequest } from '../modificationRequest.model';
import { ModificationRequestProjector } from '../modificationRequest.projector';
import { ProjectionEnEchec } from '../../../../../modules/shared';

export const onRejetRecoursAnnulé = ModificationRequestProjector.on(
  RejetRecoursAnnulé,
  async (évènement, transaction) => {
    try {
      const {
        payload: { demandeRecoursId },
        occurredAt,
      } = évènement;

      await ModificationRequest.update(
        {
          status: 'envoyée',
          respondedBy: null,
          respondedOn: null,
          responseFileId: null,
          versionDate: occurredAt,
        },
        {
          where: {
            id: demandeRecoursId,
          },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement RejetRecoursAnnulé`,
          {
            évènement,
            nomProjection: 'ModificationRequest.RejetRecoursAnnulé',
          },
          error,
        ),
      );
    }
  },
);
