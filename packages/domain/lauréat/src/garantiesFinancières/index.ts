import {
  ConsulterGarantiesFinancièresQuery,
  ConsulterGarantiesFinancièresReadModel,
} from './consulter/consulterGarantiesFinancières.query';
import { SoumettreGarantiesFinancièresUseCase } from './soumettre/soumettreGarantiesFinancières.usecase';
import { DemanderGarantiesFinancièresUseCase } from './demander/demanderGarantiesFinancières.usecase';
import {
  ListerGarantiesFinancièresPort,
  ListerGarantiesFinancièresQuery,
  ListerGarantiesFinancièresReadModel,
} from './lister/listerGarantiesFinancières.query';
import { SupprimerGarantiesFinancièresÀTraiterUseCase } from './supprimerGarantiesFinancièresÀTraiter/supprimerGarantiesFinancièresÀTraiter.usecase';
import { ValiderGarantiesFinancièresUseCase } from './valider/validerGarantiesFinancières.usecase';
import { ImporterTypeGarantiesFinancièresUseCase } from './importer/importerTypeGarantiesFinancières.usecase';

// Query
export type GarantiesFinancièresQuery =
  | ConsulterGarantiesFinancièresQuery
  | ListerGarantiesFinancièresQuery;

export { ConsulterGarantiesFinancièresQuery, ListerGarantiesFinancièresQuery };

// ReadModel
export { ConsulterGarantiesFinancièresReadModel, ListerGarantiesFinancièresReadModel };

// UseCases
export type GarantiesFinancièresUseCase =
  | SoumettreGarantiesFinancièresUseCase
  | DemanderGarantiesFinancièresUseCase
  | SupprimerGarantiesFinancièresÀTraiterUseCase
  | ValiderGarantiesFinancièresUseCase
  | ImporterTypeGarantiesFinancièresUseCase;

export {
  SoumettreGarantiesFinancièresUseCase,
  DemanderGarantiesFinancièresUseCase,
  SupprimerGarantiesFinancièresÀTraiterUseCase,
  ValiderGarantiesFinancièresUseCase,
  ImporterTypeGarantiesFinancièresUseCase,
};

// Event
export { GarantiesFinancièresEvent } from './garantiesFinancières.aggregate';
export { GarantiesFinancièresSoumisesEvent } from './soumettre/soumettreGarantiesFinancières.behavior';
export { GarantiesFinancièresDemandéesEvent } from './demander/demanderGarantiesFinancières.behavior';
export { GarantiesFinancièresÀTraiterSuppriméesEvent } from './supprimerGarantiesFinancièresÀTraiter/supprimerGarantiesFinancièresÀTraiter.behavior';
export { GarantiesFinancièresValidéesEvent } from './valider/validerGarantiesFinancières.behavior';
export { TypeGarantiesFinancièresImportéEvent } from './importer/importerTypeGarantiesFinancières.behavior';

// Register
export {
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garantiesFinancières.register';

// ValueTypes
export * as GarantiesFinancières from './garantiesFinancières.valueType';
export * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';
export * as TypeDocumentGarantiesFinancières from './typeDocumentGarantiesFinancières.valueType';
export * as StatutGarantiesFinancières from './statutGarantiesFinancières.valueType';

// Projections
export * from './garantiesFinancières.entity';

// Ports
export { ListerGarantiesFinancièresPort };
