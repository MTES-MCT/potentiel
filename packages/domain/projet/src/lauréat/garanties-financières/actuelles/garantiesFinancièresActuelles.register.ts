import { Find } from '@potentiel-domain/entity';

import { GetProjetAggregateRoot } from '../../..';

import { registerEnregistrerGarantiesFinancièresCommand } from './enregistrer/enregistrerGarantiesFinancières.command';
import { registerEnregistrerGarantiesFinancièresUseCase } from './enregistrer/enregistrerGarantiesFinancières.usecase';
import { registerEnregistrerAttestationGarantiesFinancièresCommand } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.command';
import { registerEnregistrerAttestationGarantiesFinancièresUseCase } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.usecase';
import { registerModifierGarantiesFinancièresCommand } from './modifier/modifierGarantiesFinancières.command';
import { registerModifierGarantiesFinancièresUseCase } from './modifier/modifierGarantiesFinancières.usecase';
import { registerÉchoirGarantiesFinancièresCommand } from './échoir/échoirGarantiesFinancières.command';

export type GarantiesFinancièresActuellesQueryDependencies = {
  find: Find;
};

export type GarantiesFinancièresActuellesUseCasesDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerGarantiesFinancièresActuellesUseCases = ({
  getProjetAggregateRoot,
}: GarantiesFinancièresActuellesUseCasesDependencies) => {
  registerModifierGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerModifierGarantiesFinancièresUseCase();

  registerEnregistrerAttestationGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerEnregistrerAttestationGarantiesFinancièresUseCase();

  registerEnregistrerGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerEnregistrerGarantiesFinancièresUseCase();

  registerÉchoirGarantiesFinancièresCommand(getProjetAggregateRoot);
};

export const registerGarantiesFinancièresActuellesQueries = (
  _: GarantiesFinancièresActuellesQueryDependencies,
) => {};
