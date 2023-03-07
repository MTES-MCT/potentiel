import { errAsync, ok, okAsync, wrapInfra } from '@core/utils';
import { EntityNotFoundError } from '@modules/shared';
import { RésuméProjetQueryHandler, RésuméProjetReadModel } from '@modules/project';
import { Raccordements, GestionnaireRéseauDétail, Project } from '@infra/sequelize/projectionsNext';
import { getProjectAppelOffre } from '@config/queryProjectAO.config';

export const résuméProjetQueryHandler: RésuméProjetQueryHandler = (projectId) =>
  wrapInfra(
    Project.findByPk(projectId, {
      attributes: [
        'id',
        'appelOffreId',
        'communeProjet',
        'departementProjet',
        'familleId',
        'notifiedOn',
        'nomProjet',
        'nomCandidat',
        'regionProjet',
        'periodeId',
        'puissance',
      ],
      include: [
        {
          model: Raccordements,
          as: 'raccordements',
          include: [
            {
              model: GestionnaireRéseauDétail,
              as: 'gestionnaireRéseauDétail',
              attributes: ['codeEIC', 'raisonSociale'],
            },
          ],
        },
      ],
    }),
  )
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
    .andThen(({ projet, appelOffre }) => {
      const projetProps: RésuméProjetReadModel = {
        id: projet.id,
        appelOffreId: projet.appelOffreId,
        communeProjet: projet.communeProjet,
        departementProjet: projet.departementProjet,
        familleId: projet.familleId,
        notifiedOn: projet.notifiedOn,
        nomCandidat: projet.nomCandidat,
        nomProjet: projet.nomProjet,
        regionProjet: projet.regionProjet,
        periodeId: projet.periodeId,
        puissance: projet.puissance,
        unitePuissance: appelOffre.unitePuissance,
        ...(projet.raccordements?.identifiantGestionnaire && {
          identifiantGestionnaire: projet.raccordements.identifiantGestionnaire,
          ...(projet.raccordements.gestionnaireRéseauDétail && {
            gestionnaireRéseau: {
              codeEIC: projet.raccordements.gestionnaireRéseauDétail.codeEIC,
              raisonSociale: projet.raccordements.gestionnaireRéseauDétail.raisonSociale,
            },
          }),
        }),
      };
      return ok(projetProps);
    });
