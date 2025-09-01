import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';

import { registerDépôtSoumettreGarantiesFinancièresCommand } from './soumettre/soumettreDépôtGarantiesFinancières.command';
import { registerSoumettreDépôtGarantiesFinancièresUseCase } from './soumettre/soumettreDépôtGarantiesFinancières.usecase';

export type DépôtGarantiesFinancièresQueryDependencies = {};

export type DépôtGarantiesFinancièresUseCasesDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerDépôtGarantiesFinancièresUseCases = ({
  getProjetAggregateRoot,
}: DépôtGarantiesFinancièresUseCasesDependencies) => {
  registerDépôtSoumettreGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerSoumettreDépôtGarantiesFinancièresUseCase();
};

export const registerDépôtGarantiesFinancièresQueries = (
  _: DépôtGarantiesFinancièresQueryDependencies,
) => {};
