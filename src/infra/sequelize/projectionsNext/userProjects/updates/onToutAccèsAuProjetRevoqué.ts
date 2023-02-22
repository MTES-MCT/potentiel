import { logger } from '@core/utils';
import { ToutAccèsAuProjetRevoqué } from '@modules/authZ/events/ToutAccèsAuProjetRevoqué';
import { ProjectionEnEchec } from '@modules/shared';
import { UserProjects, UserProjectsProjector } from '../userProjects.model';

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
