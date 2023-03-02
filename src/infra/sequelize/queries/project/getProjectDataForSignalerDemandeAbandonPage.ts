import { getProjectAppelOffre } from '@config/queryProjectAO.config';
import { errAsync, ok, okAsync, Result, wrapInfra } from '@core/utils';
import {
  GetProjectDataForSignalerDemandeAbandonPage,
  ProjectDataForSignalerDemandeAbandonPage,
} from '@modules/project';
import { EntityNotFoundError } from '@modules/shared';
import { Project } from '@infra/sequelize/projectionsNext';

export const getProjectDataForSignalerDemandeAbandonPage: GetProjectDataForSignalerDemandeAbandonPage =
  ({ projectId }) => {
    return wrapInfra(Project.findByPk(projectId))
      .andThen((projet) => {
        if (!projet) {
          return errAsync(new EntityNotFoundError());
        }

        const { appelOffreId, periodeId, familleId } = projet;
        const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId });

        if (!appelOffre) {
          return errAsync(new EntityNotFoundError());
        }

        return okAsync({ projet, appelOffre });
      })
      .andThen(
        ({
          projet,
          appelOffre,
        }): Result<ProjectDataForSignalerDemandeAbandonPage, EntityNotFoundError> => {
          const {
            id,
            nomProjet,
            classe,
            nomCandidat,
            communeProjet,
            regionProjet,
            departementProjet,
            notifiedOn,
            abandonedOn,
            periodeId,
            familleId,
            appelOffreId,
            puissance,
          } = projet;

          const status = !notifiedOn
            ? 'non-notifié'
            : abandonedOn
            ? 'abandonné'
            : classe === 'Classé'
            ? 'lauréat'
            : 'éliminé';

          const project: ProjectDataForSignalerDemandeAbandonPage = {
            id,
            nomProjet,
            status,
            nomCandidat,
            communeProjet,
            regionProjet,
            departementProjet,
            notifiedOn,
            periodeId,
            familleId,
            appelOffreId,
            puissance,
            unitePuissance: appelOffre.unitePuissance,
          };

          return ok(project);
        },
      );
  };
