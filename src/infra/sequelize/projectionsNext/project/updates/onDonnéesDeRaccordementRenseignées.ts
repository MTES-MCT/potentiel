import { logger } from '@core/utils';
import {
  DonnéesDeRaccordementRenseignées,
  DonnéesDeRaccordementRenseignéesdPayload,
} from '@modules/project';
import { ProjectionEnEchec } from '@modules/shared';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';

export const onDonnéesDeRaccordementRenseignées = ProjectProjector.on(
  DonnéesDeRaccordementRenseignées,
  async (évènement, transaction) => {
    try {
      const { payload } = évènement;
      const { projetId } = payload;

      const dateMiseEnService = hasDateMiseEnService(payload)
        ? payload.dateMiseEnService
        : undefined;
      const dateFileAttente = hasDateFileAttente(payload) ? payload.dateFileAttente : undefined;
      await Project.update(
        {
          dateMiseEnService,
          dateFileAttente,
        },
        {
          where: { id: projetId },
          transaction,
        },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement DonnéesDeRaccordementRenseignées`,
          {
            évènement,
            nomProjection: 'Project.DonnéesDeRaccordementRenseignées',
          },
          error,
        ),
      );
    }
  },
);

const hasDateMiseEnService = (
  payload: DonnéesDeRaccordementRenseignéesdPayload,
): payload is DonnéesDeRaccordementRenseignéesdPayload & { dateMiseEnService: Date } => {
  return (payload as any).dateMiseEnService;
};

const hasDateFileAttente = (
  payload: DonnéesDeRaccordementRenseignéesdPayload,
): payload is DonnéesDeRaccordementRenseignéesdPayload & { dateFileAttente: Date } => {
  return (payload as any).dateFileAttente;
};
