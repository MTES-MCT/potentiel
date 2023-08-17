import {
  GestionnaireRéseauProjetModifiéEvent,
  GestionnaireRéseauProjetDéclaréEvent,
} from './gestionnaireRéseau/gestionnaireRéseau.event';

type GestionnaireRéseauProjetEvent =
  | GestionnaireRéseauProjetModifiéEvent
  | GestionnaireRéseauProjetDéclaréEvent;

export type ProjetEvent = GestionnaireRéseauProjetEvent;
