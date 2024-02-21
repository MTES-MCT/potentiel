import { LoadAggregate } from '@potentiel-domain/core';
import {
  ConsulterGarantiesFinancièresDependencies,
  registerConsulterGarantiesFinancièresQuery,
} from './consulter/consulterGarantiesFinancières.query';
import { registerSoumettreGarantiesFinancièresCommand } from './soumettre/soumettreGarantiesFinancières.command';
import { registerNotifierGarantiesFinancièresEnAttenteCommand } from './notifierGarantiesFinancièresEnAttente/notifierGarantiesFinancièresEnAttente.command';
import { registerSoumettreGarantiesFinancièresUseCase } from './soumettre/soumettreGarantiesFinancières.usecase';
import { registerNotifierGarantiesFinancièresEnAttenteUseCase } from './notifierGarantiesFinancièresEnAttente/notifierGarantiesFinancièresEnAttente.usecase';

export type GarantiesFinancièresQueryDependencies = ConsulterGarantiesFinancièresDependencies;

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
};
