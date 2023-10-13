import { DéclarerGestionnaireRéseauProjetCommand } from './déclarer/déclarerGestionnaireRéseauProjet.command';
import { ModifierGestionnaireRéseauProjetCommand } from './modifier/modifierGestionnaireRéseauProjet.command';

export type ProjetCommand =
  | DéclarerGestionnaireRéseauProjetCommand
  | ModifierGestionnaireRéseauProjetCommand;
