import { AjouterGestionnaireRéseauCommand } from './ajouter/ajouterGestionnaireRéseau.command';
import { ModifierGestionnaireRéseauCommand } from './modifier/modifierGestionnaireRéseau.command';

export type GestionnaireRéseauCommand =
  | AjouterGestionnaireRéseauCommand
  | ModifierGestionnaireRéseauCommand;
