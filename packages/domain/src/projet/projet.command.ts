import { AjouterGestionnaireRéseauProjetCommand } from './ajouter/ajouterGestionnaireRéseauProjet.command';
import { ModifierGestionnaireRéseauProjetCommand } from './modifier/modifierGestionnaireRéseauProjet.command';

export type ProjetCommand =
  | AjouterGestionnaireRéseauProjetCommand
  | ModifierGestionnaireRéseauProjetCommand;
