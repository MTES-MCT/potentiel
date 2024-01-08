import { Projection } from '@potentiel-libraries/projection';

// TODO: Doit on doit vraiment nommé les entités avec Projection, sachant que cela indique qu'on fait de l'ES dans l'infrastructure ???
export type GestionnaireRéseauProjection = Projection<
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
