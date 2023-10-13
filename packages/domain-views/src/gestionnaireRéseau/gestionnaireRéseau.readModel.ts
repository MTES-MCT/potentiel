import { ReadModel } from '@potentiel-domain/core-views';
import { RawIdentifiantGestionnaireRéseau } from '@potentiel/domain-usecases';

export type GestionnaireRéseauReadModelKey =
  `gestionnaire-réseau|${RawIdentifiantGestionnaireRéseau}`;

export type GestionnaireRéseauReadModel = ReadModel<
  'gestionnaire-réseau',
  {
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere?: string;
    };
  }
>;
