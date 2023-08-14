import { getProjectAppelOffre } from '../../../../config/queryProjectAO.config';
import { errAsync, ok, okAsync, Result, ResultAsync, wrapInfra } from '../../../../core/utils';
import { parseCahierDesChargesRéférence } from '../../../../entities';
import {
  GetProjectDataForSignalerDemandeDelaiPage,
  ProjectDataForSignalerDemandeDelaiPage,
} from '../../../../modules/project';
import { EntityNotFoundError, InfraNotAvailableError } from '../../../../modules/shared';
import { Op } from 'sequelize';
import { Project, ModificationRequest } from "../../projectionsNext";
import { getDélaiCDC2022Applicable } from './getDélaiCdc2022Applicable';

export const getProjectDataForSignalerDemandeDelaiPage: GetProjectDataForSignalerDemandeDelaiPage =
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
        }): Result<
          Omit<ProjectDataForSignalerDemandeDelaiPage, 'hasPendingDemandeDelai'>,
          EntityNotFoundError
        > => {
          const {
            id,
            completionDueOn,
            nomProjet,
            nomCandidat,
            communeProjet,
            regionProjet,
            departementProjet,
            notifiedOn,
            periodeId,
            familleId,
            appelOffreId,
            cahierDesChargesActuel,
            puissance,
          } = projet;

          const project = {
            id,
            nomProjet,
            ...(completionDueOn > 0 && { completionDueOn }),
            nomCandidat,
            communeProjet,
            regionProjet,
            departementProjet,
            notifiedOn,
            periodeId,
            familleId,
            appelOffreId,
            cahierDesChargesActuel,
            puissance,
            unitePuissance: appelOffre.unitePuissance,
          };

          const cahierDesChargesParsed = parseCahierDesChargesRéférence(cahierDesChargesActuel);

          if (
            cahierDesChargesParsed.type === 'modifié' &&
            cahierDesChargesParsed.paruLe === '30/08/2022'
          ) {
            const délaiCDC2022Applicable = getDélaiCDC2022Applicable({
              familleId,
              periodeId,
              appelOffreId,
              cahierDesChargesParsed,
            });

            return ok({ ...project, délaiCDC2022Applicable });
          }

          return ok(project);
        },
      )
      .andThen((project) => {
        return hasPendingDemandeDelai(project.id).andThen((count) =>
          ok({
            ...project,
            hasPendingDemandeDelai: count > 0 ? true : false,
          }),
        );
      });
  };

const hasPendingDemandeDelai: (projectId: string) => ResultAsync<number, InfraNotAvailableError> = (
  projectId,
) =>
  wrapInfra(
    ModificationRequest.findAndCountAll({
      where: {
        projectId,
        type: 'delai',
        status: { [Op.notIn]: ['acceptée', 'rejetée', 'annulée'] },
      },
    }),
  ).andThen(({ count }) => ok(count));
