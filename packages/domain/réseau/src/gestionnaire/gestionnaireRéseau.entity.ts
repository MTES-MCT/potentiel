import { Projection } from '@potentiel-domain/entity';

export type GestionnaireRéseauEntity = Projection<
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
