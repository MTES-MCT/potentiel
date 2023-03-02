import { err, ok, wrapInfra } from '@core/utils';
import { getProjectAppelOffre } from '@config/queryProjectAO.config';
import { EntityNotFoundError } from '@modules/shared';
import { Project } from '@infra/sequelize/projectionsNext';
import { GetProjectDataForChoisirCDCPage, ProjectDataForChoisirCDCPage } from '@modules/project';
import { CahierDesChargesRéférence } from '@entities';
import { Raccordements } from '../../projectionsNext/raccordements/raccordements.model';

export const getProjectDataForChoisirCDCPage: GetProjectDataForChoisirCDCPage = (projectId) => {
  return wrapInfra(
    Project.findOne({
      where: {
        id: projectId,
      },
      include: [
        {
          model: Raccordements,
          as: 'raccordements',
          attributes: ['identifiantGestionnaire'],
        },
      ],
    }),
  ).andThen((project) => {
    if (!project) return err(new EntityNotFoundError());

    const { id, appelOffreId, periodeId, familleId, cahierDesChargesActuel, raccordements } =
      project;

    const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId });
    if (!appelOffre) return err(new EntityNotFoundError());

    const pageProps: ProjectDataForChoisirCDCPage = {
      id,
      appelOffre,
      cahierDesChargesActuel: cahierDesChargesActuel as CahierDesChargesRéférence,
      ...(raccordements &&
        raccordements.identifiantGestionnaire && {
          identifiantGestionnaireRéseau: raccordements.identifiantGestionnaire,
        }),
    };

    return ok(pageProps);
  });
};
