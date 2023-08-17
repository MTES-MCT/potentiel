import { GarantiesFinancièresUseCase } from './garantiesFinancières/garantiesFinancières.usecase';
import { GestionnaireRéseauUseCase } from './gestionnaireRéseau/gestionnaireRéseau.usecase';
import { ProjetUseCase } from './projet/projet.usecase';
import { RaccordementUsecase } from './raccordement/raccordement.usecase';

export type DomainUseCase =
  | GestionnaireRéseauUseCase
  | ProjetUseCase
  | RaccordementUsecase
  | GarantiesFinancièresUseCase;
