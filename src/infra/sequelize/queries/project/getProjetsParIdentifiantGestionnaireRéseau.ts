import { GetProjetsParIdentifiantGestionnaireRéseau } from '@modules/imports/donnéesRaccordement';
import { okAsync, wrapInfra } from '@core/utils';
import { Raccordements } from '@infra/sequelize/projectionsNext';
import { Op } from 'sequelize';

export const getProjetsParIdentifiantGestionnaireRéseau: GetProjetsParIdentifiantGestionnaireRéseau =
  (identifiantsGestionnaireRéseau) => {
    return wrapInfra(
      Raccordements.findAll({
        where: {
          identifiantGestionnaire: {
            [Op.iLike]: { [Op.any]: identifiantsGestionnaireRéseau.map((id) => `%${id}%`) },
          },
        },
        attributes: ['projetId', 'identifiantGestionnaire'],
      }),
    ).andThen((projets) => {
      return okAsync(
        identifiantsGestionnaireRéseau.reduce((acc, identifiantGR) => {
          return {
            ...acc,
            [identifiantGR]: projets
              .filter((raccordement) =>
                raccordement.identifiantGestionnaire
                  ?.toLowerCase()
                  .includes(identifiantGR.toLowerCase()),
              )
              .map(({ projetId }) => ({ projetId })),
          };
        }, {}),
      );
    });
  };
