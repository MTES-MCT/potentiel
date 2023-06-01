import { DomainEvent } from '@potentiel/core-domain';

export type GestionnaireRéseauModifiéEvent = DomainEvent<
  'GestionnaireRéseauModifié',
  {
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: { format: string; légende: string };
  }
>;
