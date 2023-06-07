import { DomainEvent } from '@potentiel/core-domain';

export type GestionnaireRéseauProjetModifiéEvent = DomainEvent<
  'GestionnaireRéseauProjetModifié',
  {
    identifiantProjet: string;
    identifiantGestionnaireRéseau: string;
  }
>;

export type GestionnaireRéseauProjetAjoutéEvent = DomainEvent<
  'GestionnaireRéseauProjetAjouté',
  {
    identifiantProjet: string;
    identifiantGestionnaireRéseau: string;
  }
>;

export type ProjetEvent =
  | GestionnaireRéseauProjetModifiéEvent
  | GestionnaireRéseauProjetAjoutéEvent;
