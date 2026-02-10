import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port.js';

import {
  ConsulterTypologieInstallationDependencies,
  registerConsulterTypologieInstallationQuery,
} from './consulter/consulterTypologieInstallation.query.js';
import { registerModifierTypologieInstallationCommand } from './modifier/modifierTypologieInstallation.command.js';
import { registerModifierTypologieInstallationUseCase } from './modifier/modifierTypologieInstallation.usecase.js';

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
