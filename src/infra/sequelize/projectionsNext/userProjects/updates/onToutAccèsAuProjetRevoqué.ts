import { logger } from '../../../../../core/utils';
import { ToutAccèsAuProjetRevoqué } from '../../../../../modules/authZ/events';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { UserProjects } from '../userProjects.model';
import { UserProjectsProjector } from '../userProjects.projector';

export default UserProjectsProjector.on(
  ToutAccèsAuProjetRevoqué,
  async (évènement, transaction) => {
    const {
      payload: { projetId },
    } = évènement;
    try {
      await UserProjects.destroy({ where: { projectId: projetId }, transaction });
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ToutAccèsAuProjetRevoqué`,
          {
            évènement,
            nomProjection: 'UserProjects.ToutAccèsAuProjetRevoqué',
          },
          error,
        ),
      );
    }
  },
);
