import { SoumettreDépôtGarantiesFinancièresUseCase } from './soumettre/soumettreDépôtGarantiesFinancières.usecase';
import { ValiderDépôtGarantiesFinancièresEnCoursUseCase } from './valider/validerDépôtGarantiesFinancières.usecase';

// UseCases
export type DépôtGarantiesFinancièresUseCases =
  | SoumettreDépôtGarantiesFinancièresUseCase
  | ValiderDépôtGarantiesFinancièresEnCoursUseCase;
export {
  SoumettreDépôtGarantiesFinancièresUseCase,
  ValiderDépôtGarantiesFinancièresEnCoursUseCase,
};
