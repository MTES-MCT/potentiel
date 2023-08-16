import { errAsync, okAsync, wrapInfra } from '../../../../core/utils';
import { EntityNotFoundError } from '../../../../modules/shared';
import { GetProjectDataForChoisirCDCPage } from '../../../../modules/project';
import { Project } from '../../projectionsNext';
import { getProjectAppelOffre } from '../../../../config/queryProjectAO.config';
import { CahierDesChargesRéférence } from '../../../../entities';

export const getProjectDataForChoisirCDCPage: GetProjectDataForChoisirCDCPage = (projectId) =>
  wrapInfra(
    Project.findByPk(projectId, {
      attributes: ['id', 'appelOffreId', 'familleId', 'periodeId', 'cahierDesChargesActuel'],
    }),
  ).andThen((projet) => {
    if (!projet) {
      return errAsync(new EntityNotFoundError());
    }

    const appelOffre = getProjectAppelOffre({
      appelOffreId: projet.appelOffreId,
      periodeId: projet.periodeId,
      familleId: projet.familleId,
    });

    if (!appelOffre) {
      return errAsync(new EntityNotFoundError());
    }

    const projetProps = {
      id: projet.id,
      cahierDesChargesActuel: projet.cahierDesChargesActuel as CahierDesChargesRéférence,
      appelOffre,
    };

    return okAsync(projetProps);
  });
