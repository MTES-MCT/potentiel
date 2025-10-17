import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';

import {
  ConsulterTypologieInstallationDependencies,
  registerConsulterTypologieInstallationQuery,
} from './consulter/consulterTypologieInstallation.query';
import { registerModifierTypologieInstallationCommand } from './modifier/modifierTypologieInstallation.command';
import { registerModifierTypologieInstallationUseCase } from './modifier/modifierTypologieInstallation.usecase';

export type TypologieInstallationQueryDependencies = ConsulterTypologieInstallationDependencies;

export type TypologieInstallationUseCaseDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerTypologieInstallationUseCases = (
  dependencies: TypologieInstallationUseCaseDependencies,
) => {
  registerModifierTypologieInstallationCommand(dependencies.getProjetAggregateRoot);
  registerModifierTypologieInstallationUseCase();
};

export const registerTypologieInstallationQueries = (
  dependencies: TypologieInstallationQueryDependencies,
) => {
  registerConsulterTypologieInstallationQuery(dependencies);
};
