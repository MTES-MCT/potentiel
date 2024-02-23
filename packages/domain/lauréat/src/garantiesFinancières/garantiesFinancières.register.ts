import { LoadAggregate } from '@potentiel-domain/core';
import {
  ConsulterGarantiesFinancièresDependencies,
  registerConsulterGarantiesFinancièresQuery,
} from './consulter/consulterGarantiesFinancières.query';
import { registerSoumettreGarantiesFinancièresCommand } from './soumettre/soumettreGarantiesFinancières.command';
import { registerNotifierGarantiesFinancièresEnAttenteCommand } from './notifierGarantiesFinancièresEnAttente/notifierGarantiesFinancièresEnAttente.command';
import { registerSoumettreGarantiesFinancièresUseCase } from './soumettre/soumettreGarantiesFinancières.usecase';
import { registerNotifierGarantiesFinancièresEnAttenteUseCase } from './notifierGarantiesFinancièresEnAttente/notifierGarantiesFinancièresEnAttente.usecase';
import {
  ListerGarantiesFinancièresDependencies,
  registerListerGarantiesFinancièresQuery,
} from './lister/listerGarantiesFinancières.query';

export type GarantiesFinancièresQueryDependencies = ConsulterGarantiesFinancièresDependencies &
  ListerGarantiesFinancièresDependencies;

export type GarantiesFinancièresCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerGarantiesFinancièresUseCases = ({
  loadAggregate,
}: GarantiesFinancièresCommandDependencies) => {
  registerSoumettreGarantiesFinancièresCommand(loadAggregate);
  registerNotifierGarantiesFinancièresEnAttenteCommand(loadAggregate);

  registerSoumettreGarantiesFinancièresUseCase();
  registerNotifierGarantiesFinancièresEnAttenteUseCase();
};

export const registerGarantiesFinancièresQueries = (
  dependencies: GarantiesFinancièresQueryDependencies,
) => {
  registerConsulterGarantiesFinancièresQuery(dependencies);
  registerListerGarantiesFinancièresQuery(dependencies);
};
