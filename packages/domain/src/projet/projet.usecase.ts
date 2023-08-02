import { ModifierGestionnaireRéseauProjetUseCase } from './gestionnaireRéseau/modifier/modifierGestionnaireRéseauProjet.usecase';

export type ProjetUseCase =
  | ModifierGestionnaireRéseauProjetUseCase
  | EnregistrerGarantiesFinancièresUseCase;
