import { DomainEvent } from '@potentiel-domain/core';

/**
 * @deprecated use GestionnaireRéseauAjoutéEvent instead
 */
export type GestionnaireRéseauAjoutéEventV1 = DomainEvent<
  'GestionnaireRéseauAjouté-V1',
  {
    raisonSociale: string;
    codeEIC: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere?: string;
    };
  }
>;

export type GestionnaireRéseauAjoutéEvent = DomainEvent<
  'GestionnaireRéseauAjouté-V2',
  {
    raisonSociale: string;
    codeEIC: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
    contactEmail: string;
  }
>;
