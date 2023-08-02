import { DéclarerGestionnaireRéseauProjetCommand } from './gestionnaireRéseau/déclarer/déclarerGestionnaireRéseauProjet.command';
import { ModifierGestionnaireRéseauProjetCommand } from './gestionnaireRéseau/modifier/modifierGestionnaireRéseauProjet.command';

export type ProjetCommand =
  | DéclarerGestionnaireRéseauProjetCommand
  | ModifierGestionnaireRéseauProjetCommand
  | EnregistrerTypeGarantiesFinancièresCommand
  | EnregistrerAttestationGarantiesFinancièresCommand
  | EnregistrerGarantiesFinancièresComplètesCommand;
