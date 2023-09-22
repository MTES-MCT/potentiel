import { GestionnaireRéseauUseCase } from './gestionnaireRéseau/gestionnaireRéseau.usecase';
import { GestionnaireRéseauProjetUseCase } from './projet/lauréat/gestionnaireRéseau/gestionnaireRéseauProjet.usecase';
import { RaccordementUsecase } from './raccordement/raccordement.usecase';
import { AbandonUsecase } from './projet/lauréat/abandon/abandon.usecase';

export type DomainUseCase =
  | AbandonUsecase
  | GestionnaireRéseauUseCase
  | GestionnaireRéseauProjetUseCase
  | RaccordementUsecase;
