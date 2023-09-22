import { GestionnaireRéseauUseCase } from './gestionnaireRéseau/gestionnaireRéseau.usecase';
import { GestionnaireRéseauProjetUseCase } from './projet/lauréat/gestionnaireRéseau/gestionnaireRéseauProjet.usecase';
import { RaccordementUsecase } from './raccordement/raccordement.usecase';

export type DomainUseCase =
  | GestionnaireRéseauUseCase
  | GestionnaireRéseauProjetUseCase
  | RaccordementUsecase;
