import { wrapInfra } from '@core/utils';
import { TrouverProjetsParIdentifiantGestionnaireRéseau } from '@modules/project';
import { Raccordements } from '@infra/sequelize/projectionsNext';
import { okAsync } from 'neverthrow';

export const trouverProjetsParIdentifiantGestionnaireRéseau: TrouverProjetsParIdentifiantGestionnaireRéseau =
  (identifiantGestionnaire) =>
    wrapInfra(
      Raccordements.findAll({
        attributes: ['projetId'],
        where: {
          identifiantGestionnaire,
        },
      }),
    ).andThen((raccordements) =>
      okAsync(raccordements.map((raccordement) => raccordement.projetId)),
    );
