import { errAsync, ok, okAsync, wrapInfra } from '@core/utils';
import { EntityNotFoundError } from '@modules/shared';
import { GetProjectDataForChoisirCDCPage } from '@modules/project';
import { Raccordements, GestionnaireRéseau, Project } from '@infra/sequelize/projectionsNext';
import { getProjectAppelOffre } from '@config/queryProjectAO.config';
import { CahierDesChargesRéférence } from '@entities';

export const getProjectDataForChoisirCDCPage: GetProjectDataForChoisirCDCPage = (projectId) =>
  wrapInfra(
    Project.findByPk(projectId, {
      attributes: ['id', 'appelOffreId', 'familleId', 'periodeId', 'cahierDesChargesActuel'],
      include: [
        {
          model: Raccordements,
          as: 'raccordements',
          include: [
            {
              model: GestionnaireRéseau,
              as: 'gestionnaireRéseau',
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
        ...(projet.raccordements?.identifiantGestionnaire && {
          identifiantGestionnaireRéseau: projet.raccordements.identifiantGestionnaire,
        }),
        ...(projet.raccordements?.gestionnaireRéseau && {
          gestionnaireRéseau: {
            codeEIC: projet.raccordements.gestionnaireRéseau.codeEIC,
            raisonSociale: projet.raccordements.gestionnaireRéseau.raisonSociale,
          },
        }),
      };

      return okAsync(projetProps);
    })
    .andThen((projetProps) =>
      wrapInfra(GestionnaireRéseau.findAll({ raw: true })).andThen((listeGestionnairesRéseau) => {
        return ok({ listeGestionnairesRéseau, ...projetProps });
      }),
    );
