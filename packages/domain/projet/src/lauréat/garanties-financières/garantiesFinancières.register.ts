import { GetProjetAggregateRoot } from '../..';

import { registerEnregistrerAttestationGarantiesFinancièresCommand } from './actuelles/enregistrerAttestation/enregistrerAttestationGarantiesFinancières.command';
import { registerEnregistrerAttestationGarantiesFinancièresUseCase } from './actuelles/enregistrerAttestation/enregistrerAttestationGarantiesFinancières.usecase';
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

  registerEnregistrerAttestationGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerEnregistrerAttestationGarantiesFinancièresUseCase();
};

export const registerGarantiesFinancièresQueries = (_: GarantiesFinancièresQueryDependencies) => {};
