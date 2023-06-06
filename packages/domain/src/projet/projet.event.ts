import { DomainEvent } from '@potentiel/core-domain';

export type GestionnaireRéseauProjetModifiéEvent = DomainEvent<
  'GestionnaireRéseauProjetModifié',
  {
    identifiantProjet: string;
    identifiantGestionnaireRéseau: string;
  }
>;

export type ProjetEvent = GestionnaireRéseauProjetModifiéEvent;
