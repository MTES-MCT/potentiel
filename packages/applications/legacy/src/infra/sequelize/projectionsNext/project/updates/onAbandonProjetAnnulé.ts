import { logger } from '../../../../../core/utils';
import { AbandonProjetAnnulé } from '../../../../../modules/project';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';

export const onAbandonProjetAnnulé = ProjectProjector.on(
  AbandonProjetAnnulé,
  async (évènement, transaction) => {
    try {
      const {
        payload: { dateAchèvement, dateLimiteEnvoiDcr, projetId },
      } = évènement;
      await Project.update(
        {
          abandonedOn: 0,
          ...(dateLimiteEnvoiDcr && {
            dcrDueOn: dateLimiteEnvoiDcr.getTime(),
          }),
          completionDueOn: dateAchèvement.getTime(),
        },
        { where: { id: projetId }, transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement AbandonProjetAnnulé`,
          {
            évènement,
            nomProjection: 'Project.AbandonProjetAnnulé',
          },
          error,
        ),
      );
    }
  },
);
