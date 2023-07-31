import {
  AttestationGarantiesFinancièresEnregistréeEvent,
  TypeGarantiesFinancièresEnregistréEvent,
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
  | TypeGarantiesFinancièresEnregistréEvent;

export type ProjetEvent = GestionnaireRéseauProjetEvent | GarantiesFinancièresEvent;
