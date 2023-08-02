import { EnregistrerGarantiesFinancièresUseCase } from './garantiesFinancières/enregistrerGarantiesFinancières.usecase';
import { ModifierGestionnaireRéseauProjetUseCase } from './gestionnaireRéseau/modifier/modifierGestionnaireRéseauProjet.usecase';

export type ProjetUseCase =
  | ModifierGestionnaireRéseauProjetUseCase
  | EnregistrerGarantiesFinancièresUseCase;
