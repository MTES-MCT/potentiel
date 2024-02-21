import {
  ConsulterGarantiesFinancièresQuery,
  ConsulterGarantiesFinancièresReadModel,
} from './consulter/consulterGarantiesFinancières.query';
import { SoumettreGarantiesFinancièresUseCase } from './soumettre/soumettreGarantiesFinancières.usecase';
import { NotifierGarantiesFinancièresEnAttenteUseCase } from './notifierGarantiesFinancièresEnAttente/notifierGarantiesFinancièresEnAttente.usecase';

// Query
export type GarantiesFinancièresQuery = ConsulterGarantiesFinancièresQuery;

export { ConsulterGarantiesFinancièresQuery };

// ReadModel
export { ConsulterGarantiesFinancièresReadModel };

// UseCases
export type GarantiesFinancièresUseCase =
  | SoumettreGarantiesFinancièresUseCase
  | NotifierGarantiesFinancièresEnAttenteUseCase;

export { SoumettreGarantiesFinancièresUseCase, NotifierGarantiesFinancièresEnAttenteUseCase };

// Event
export { GarantiesFinancièresEvent } from './garantiesFinancières.aggregate';
export { GarantiesFinancièresSoumisesEvent } from './soumettre/soumettreGarantiesFinancières.behavior';
export { GarantiesFinancièresEnAttenteNotifiéEvent } from './notifierGarantiesFinancièresEnAttente/notifierGarantiesFinancièresEnAttente.behavior';

// Register
export {
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garantiesFinancières.register';

// ValueTypes
export * as GarantiesFinancières from './garantiesFinancières.valueType';
export * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';
export * as TypeDocumentGarantiesFinancières from './typeDocumentGarantiesFinancières.valueType';

// Projections
export * from './garantiesFinancières.projection';

// Ports
