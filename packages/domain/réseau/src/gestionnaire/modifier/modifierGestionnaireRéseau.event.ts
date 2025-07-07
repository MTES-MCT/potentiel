import { DomainEvent } from '@potentiel-domain/core';

/**
 * @deprecated Use GestionnaireRéseauModifiéEvent instead
 */
export type GestionnaireRéseauModifiéEventV1 = DomainEvent<
  'GestionnaireRéseauModifié-V1',
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

export type GestionnaireRéseauModifiéEvent = DomainEvent<
  'GestionnaireRéseauModifié-V2',
  {
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
    contactEmail: string;
  }
>;
