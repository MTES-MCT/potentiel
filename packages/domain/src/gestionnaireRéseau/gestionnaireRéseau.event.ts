import { DomainEvent } from '@potentiel/core-domain';

export type GestionnaireRéseauAjoutéEvent = DomainEvent<
  'GestionnaireRéseauAjouté',
  {
    raisonSociale: string;
    codeEIC: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
  }
>;

export type GestionnaireRéseauModifiéEvent = DomainEvent<
  'GestionnaireRéseauModifié',
  {
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
  }
>;

export type GestionnaireRéseauEvent =
  | GestionnaireRéseauModifiéEvent
  | GestionnaireRéseauAjoutéEvent;
