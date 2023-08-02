import {
  AttestationGarantiesFinancièresEnregistréeEvent,
  TypeGarantiesFinancièresEnregistréEventV1,
  TypeGarantiesFinancièresEnregistréEventV0,
} from './garantiesFinancières/garantiesFinancières.event';
import {
  GestionnaireRéseauProjetModifiéEvent,
  GestionnaireRéseauProjetDéclaréEvent,
} from './gestionnaireRéseau/gestionnaireRéseau.event';

type GestionnaireRéseauProjetEvent =
  | GestionnaireRéseauProjetModifiéEvent
  | GestionnaireRéseauProjetDéclaréEvent;

export type GarantiesFinancièresEvent =
  | AttestationGarantiesFinancièresEnregistréeEvent
  | TypeGarantiesFinancièresEnregistréEventV1
  | TypeGarantiesFinancièresEnregistréEventV0;

export type ProjetEvent = GestionnaireRéseauProjetEvent | GarantiesFinancièresEvent;
