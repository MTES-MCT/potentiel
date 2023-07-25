import { ReadModel } from '@potentiel/core-domain';
import { RawIdentifiantGestionnaireRéseau } from '@potentiel/domain';

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
