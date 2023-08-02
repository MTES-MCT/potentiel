import { DomainEvent } from '@potentiel/core-domain';

export type GestionnaireRéseauProjetModifiéEvent = DomainEvent<
  'GestionnaireRéseauProjetModifié',
  {
    identifiantProjet: string;
    identifiantGestionnaireRéseau: string;
  }
>;

export type GestionnaireRéseauProjetDéclaréEvent = DomainEvent<
  'GestionnaireRéseauProjetDéclaré',
  {
    identifiantProjet: string;
    identifiantGestionnaireRéseau: string;
  }
>;
