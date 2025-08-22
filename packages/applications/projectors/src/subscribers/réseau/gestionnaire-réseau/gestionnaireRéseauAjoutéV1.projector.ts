import { match, P } from 'ts-pattern';

import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { ExpressionRegulière } from '@potentiel-domain/common';

export const gestionnaireRéseauAjoutéV1Projector = async ({
  payload: {
    aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
    codeEIC,
    raisonSociale,
  },
}:
  | GestionnaireRéseau.GestionnaireRéseauAjoutéEventV1
  | GestionnaireRéseau.GestionnaireRéseauModifiéEventV1) => {
  await upsertProjection<GestionnaireRéseau.GestionnaireRéseauEntity>(
    `gestionnaire-réseau|${codeEIC}`,
    {
      codeEIC,
      raisonSociale,
      contactEmail: '',
      aideSaisieRéférenceDossierRaccordement: {
        format,
        légende,
        expressionReguliere: match(expressionReguliere)
          .with('', () => ExpressionRegulière.accepteTout)
          .with(P.nullish, () => ExpressionRegulière.accepteTout)
          .otherwise((value) => ExpressionRegulière.convertirEnValueType(value))
          .formatter(),
      },
    },
  );
};
