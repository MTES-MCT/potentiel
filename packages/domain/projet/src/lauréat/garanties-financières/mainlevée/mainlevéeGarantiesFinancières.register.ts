import { GetProjetAggregateRoot } from '../../..';

import { registerAnnulerMainlevéeGarantiesFinancièresCommand } from './annuler/annulerDemandeMainlevéeGarantiesFinancières.command';
import { registerAnnulerMainlevéeGarantiesFinancièresUseCase } from './annuler/annulerMainlevéeGarantiesFinancières.usecase';
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
  registerAnnulerMainlevéeGarantiesFinancièresCommand(getProjetAggregateRoot);

  registerDemanderMainlevéeGarantiesFinancièresUseCase();
  registerAnnulerMainlevéeGarantiesFinancièresUseCase();
};

export const registerMainlevéeGarantiesFinancièresQueries = (
  _: MainlevéeGarantiesFinancièresQueryDependencies,
) => {};
