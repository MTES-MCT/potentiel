import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';

import {
  ConsulterTypologieInstallationDependencies,
  registerConsulterTypologieInstallationQuery,
} from './consulter/consulterTypologieInstallation.query';
import {
  ListerHistoriqueTypologieInstallationProjetDependencies,
  registerListerHistoriqueTypologieInstallationProjetQuery,
} from './listerHistorique/listerHistoriqueTypologieInstallationProjet.query';
import { registerModifierTypologieInstallationCommand } from './modifier/modifierTypologieInstallation.command';
import { registerModifierTypologieInstallationUseCase } from './modifier/modifierTypologieInstallation.usecase';

export type TypologieInstallationQueryDependencies = ConsulterTypologieInstallationDependencies &
  ListerHistoriqueTypologieInstallationProjetDependencies;

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
  registerListerHistoriqueTypologieInstallationProjetQuery(dependencies);
};
