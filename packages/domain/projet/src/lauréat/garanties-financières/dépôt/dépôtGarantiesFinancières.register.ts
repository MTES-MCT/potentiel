import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';

import { registerSoumettreDépôtGarantiesFinancièresCommand } from './soumettre/soumettreDépôtGarantiesFinancières.command';
import { registerSoumettreDépôtGarantiesFinancièresUseCase } from './soumettre/soumettreDépôtGarantiesFinancières.usecase';
import { registerValiderDépôtGarantiesFinancièresEnCoursCommand } from './valider/validerDépôtGarantiesFinancières.command';
import { registerValiderDépôtGarantiesFinancièresEnCoursUseCase } from './valider/validerDépôtGarantiesFinancières.usecase';

export type DépôtGarantiesFinancièresQueryDependencies = {};

export type DépôtGarantiesFinancièresUseCasesDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerDépôtGarantiesFinancièresUseCases = ({
  getProjetAggregateRoot,
}: DépôtGarantiesFinancièresUseCasesDependencies) => {
  registerSoumettreDépôtGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerSoumettreDépôtGarantiesFinancièresUseCase();

  registerValiderDépôtGarantiesFinancièresEnCoursCommand(getProjetAggregateRoot);
  registerValiderDépôtGarantiesFinancièresEnCoursUseCase();
};

export const registerDépôtGarantiesFinancièresQueries = (
  _: DépôtGarantiesFinancièresQueryDependencies,
) => {};
