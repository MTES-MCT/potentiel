import { EnregistrerAttestationGarantiesFinancièresCommand } from './garantiesFinancières/enregistrerAttestationGarantiesFinancières.command';
import { EnregistrerTypeGarantiesFinancièresCommand } from './garantiesFinancières/enregistrerTypeGarantiesFinancières.command';
import { DéclarerGestionnaireRéseauProjetCommand } from './gestionnaireRéseau/déclarer/déclarerGestionnaireRéseauProjet.command';
import { ModifierGestionnaireRéseauProjetCommand } from './gestionnaireRéseau/modifier/modifierGestionnaireRéseauProjet.command';

export type ProjetCommand =
  | DéclarerGestionnaireRéseauProjetCommand
  | ModifierGestionnaireRéseauProjetCommand
  | EnregistrerTypeGarantiesFinancièresCommand
  | EnregistrerAttestationGarantiesFinancièresCommand;
