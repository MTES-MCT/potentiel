import { GetProjetAggregateRoot } from '../../..';

import { registerDemanderMainlevéeGarantiesFinancièresCommand } from './demander/demanderMainlevéeGarantiesFinancières.command';
import { registerDemanderMainlevéeGarantiesFinancièresUseCase } from './demander/demanderMainlevéeGarantiesFinancières.usecase';

export type MainlevéeGarantiesFinancièresQueryDependencies = {};

export type MainlevéeGarantiesFinancièresUseCasesDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerMainlevéeGarantiesFinancièresUseCases = ({
  getProjetAggregateRoot,
}: MainlevéeGarantiesFinancièresUseCasesDependencies) => {
  registerDemanderMainlevéeGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerDemanderMainlevéeGarantiesFinancièresUseCase();
};

export const registerMainlevéeGarantiesFinancièresQueries = (
  _: MainlevéeGarantiesFinancièresQueryDependencies,
) => {};
