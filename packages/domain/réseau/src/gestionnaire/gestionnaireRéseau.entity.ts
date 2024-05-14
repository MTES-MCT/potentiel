import { Entity } from '@potentiel-domain/core';

export type GestionnaireRéseauEntity = Entity<
  'gestionnaire-réseau',
  {
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
    contactInformations?: {
      email?: string;
      phone?: string;
    };
  }
>;
