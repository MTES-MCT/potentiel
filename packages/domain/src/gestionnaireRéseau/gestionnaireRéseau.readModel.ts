import { ReadModel } from '@potentiel/core-domain';

export type GestionnaireRéseauReadModel = ReadModel<
  'gestionnaire-réseau',
  {
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
    };
  }
>;
