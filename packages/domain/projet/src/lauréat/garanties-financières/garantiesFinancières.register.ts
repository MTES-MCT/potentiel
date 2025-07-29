import { GetProjetAggregateRoot } from '../..';

import { registerModifierGarantiesFinancièresCommand } from './actuelles/modifier/modifierGarantiesFinancières.command';
import { registerModifierGarantiesFinancièresUseCase } from './actuelles/modifier/modifierGarantiesFinancières.usecase';

export type GarantiesFinancièresQueryDependencies = {};

export type GarantiesFinancièresUseCasesDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerGarantiesFinancièresUseCases = ({
  getProjetAggregateRoot,
}: GarantiesFinancièresUseCasesDependencies) => {
  registerModifierGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerModifierGarantiesFinancièresUseCase();
};

export const registerGarantiesFinancièresQueries = (_: GarantiesFinancièresQueryDependencies) => {};
