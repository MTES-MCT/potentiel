import { DomainEvent } from '@potentiel/core-domain';

export type GestionnaireRéseauModifiéEvent = DomainEvent<
  'GestionnaireRéseauModifié',
  { raisonSociale: string; format: string; légende: string }
>;
