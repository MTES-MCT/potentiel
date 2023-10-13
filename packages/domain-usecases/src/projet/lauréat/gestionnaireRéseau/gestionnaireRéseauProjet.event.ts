import { DomainEvent } from '@potentiel-domain/core';

export type GestionnaireRéseauProjetModifiéEventV1 = DomainEvent<
  'GestionnaireRéseauProjetModifié-V1',
  {
    identifiantProjet: string;
    identifiantGestionnaireRéseau: string;
  }
>;

export type GestionnaireRéseauProjetDéclaréEventV1 = DomainEvent<
  'GestionnaireRéseauProjetDéclaré-V1',
  {
    identifiantProjet: string;
    identifiantGestionnaireRéseau: string;
  }
>;

export type GestionnaireRéseauProjetEvent =
  | GestionnaireRéseauProjetModifiéEventV1
  | GestionnaireRéseauProjetDéclaréEventV1;
