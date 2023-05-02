import { ReadModel } from '@potentiel/core-domain';

export type GestionnaireRéseauReadModelKey =
  `gestionnaire-réseau#${GestionnaireRéseauReadModel['codeEIC']}`;

export type GestionnaireRéseauReadModel = ReadModel<
  'gestionnaire-réseau' | 'gestionnaire-réseau-du-projet',
  {
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
    };
  }
>;
