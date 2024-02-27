import { LoadAggregate } from '@potentiel-domain/core';
import {
  ConsulterGarantiesFinancièresDependencies,
  registerConsulterGarantiesFinancièresQuery,
} from './consulter/consulterGarantiesFinancières.query';
import { registerSoumettreGarantiesFinancièresCommand } from './soumettre/soumettreGarantiesFinancières.command';
import { registerDemanderGarantiesFinancièresCommand } from './demander/demanderGarantiesFinancières.command';
import { registerSoumettreGarantiesFinancièresUseCase } from './soumettre/soumettreGarantiesFinancières.usecase';
import { registerDemanderGarantiesFinancièresUseCase } from './demander/demanderGarantiesFinancières.usecase';
import {
  ListerGarantiesFinancièresDependencies,
  registerListerGarantiesFinancièresQuery,
} from './lister/listerGarantiesFinancières.query';
import { registerSupprimerGarantiesFinancièresÀTraiterCommand } from './supprimerGarantiesFinancièresÀTraiter/supprimerGarantiesFinancièresÀTraiter.command';
import { registerSupprimerGarantiesFinancièresÀTraiterUseCase } from './supprimerGarantiesFinancièresÀTraiter/supprimerGarantiesFinancièresÀTraiter.usecase';
import { registerValiderGarantiesFinancièresCommand } from './valider/validerGarantiesFinancières.command';
import { registerValiderGarantiesFinancièresUseCase } from './valider/validerGarantiesFinancières.usecase';

export type GarantiesFinancièresQueryDependencies = ConsulterGarantiesFinancièresDependencies &
  ListerGarantiesFinancièresDependencies;

export type GarantiesFinancièresCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerGarantiesFinancièresUseCases = ({
  loadAggregate,
}: GarantiesFinancièresCommandDependencies) => {
  registerSoumettreGarantiesFinancièresCommand(loadAggregate);
  registerDemanderGarantiesFinancièresCommand(loadAggregate);
  registerSupprimerGarantiesFinancièresÀTraiterCommand(loadAggregate);
  registerValiderGarantiesFinancièresCommand(loadAggregate);

  registerSoumettreGarantiesFinancièresUseCase();
  registerDemanderGarantiesFinancièresUseCase();
  registerSupprimerGarantiesFinancièresÀTraiterUseCase();
  registerValiderGarantiesFinancièresUseCase();
};

export const registerGarantiesFinancièresQueries = (
  dependencies: GarantiesFinancièresQueryDependencies,
) => {
  registerConsulterGarantiesFinancièresQuery(dependencies);
  registerListerGarantiesFinancièresQuery(dependencies);
};
