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

export type TypeGarantiesFinancièresEnregistréEvent = DomainEvent<
  'TypeGarantiesFinancièresEnregistré',
  {
    identifiantProjet: string;
    type: string;
    dateÉchéance?: string;
  }
>;

export type AttestationGarantiesFinancièresEnregistréeEvent = DomainEvent<
  'AttestationGarantiesFinancièresEnregistrée',
  {
    identifiantProjet: string;
    format: string;
    dateConstitution: string;
  }
>;

export type ProjetEvent =
  | GestionnaireRéseauProjetModifiéEvent
  | GestionnaireRéseauProjetDéclaréEvent
  | AttestationGarantiesFinancièresEnregistréeEvent
  | TypeGarantiesFinancièresEnregistréEvent;
