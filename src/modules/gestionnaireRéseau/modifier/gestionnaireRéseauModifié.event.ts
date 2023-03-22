import { DomainEvent } from '@potentiel/core-domain';

export type GestionnaireRéseauModifiéEvent = DomainEvent<
  'GestionnaireRéseauModifié',
  {
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: { format: string; légende: string };
  }
>;
