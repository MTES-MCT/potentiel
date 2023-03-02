import { logger } from '@core/utils';
import { Projections } from '@infra/sequelize/models';
import { DonnéesDeRaccordementRenseignées } from '@modules/project';
import { ProjectionEnEchec } from '@modules/shared';

type onDonnéesDeRaccordementRenseignées = (
  projections: Projections,
) => (événement: DonnéesDeRaccordementRenseignées) => Promise<void>;

export const onDonnéesDeRaccordementRenseignées: onDonnéesDeRaccordementRenseignées =
  ({ Project }) =>
  async (évènement) => {
    const { payload } = évènement;

    const projectInstance = await Project.findByPk(payload.projetId);

    if (!projectInstance) {
      logger.error(
        new ProjectionEnEchec(
          'Erreur dans la projection onDonnéesDeRaccordementRenseignées : impossible de récupérer le projet de la db',
          {
            nomProjection: 'onDonnéesDeRaccordementRenseignées',
            évènement,
          },
        ),
      );
      return;
    }
    try {
      await Project.update(
        {
          ...('dateMiseEnService' in payload && {
            dateMiseEnService: payload.dateMiseEnService,
          }),
          ...('dateFileAttente' in payload && {
            dateFileAttente: payload.dateFileAttente,
          }),
        },
        {
          where: { id: payload.projetId },
        },
      );
    } catch (cause) {
      logger.error(
        new ProjectionEnEchec(
          'Erreur lors de la projection du renseignement de la date de mise en service',
          {
            nomProjection: 'onDonnéesDeRaccordementRenseignées',
            évènement,
          },
          cause,
        ),
      );
    }
  };
