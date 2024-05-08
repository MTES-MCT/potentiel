import { Entity } from '@potentiel-domain/core';

export type GestionnaireRéseauEntity = Entity<
  'gestionnaire-réseau',
  {
    codeEIC: string;
    raisonSociale: string;
    // contactInformations?: {
    //   email?: string;
    //   phone?: string;
    // };
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
  }
>;
