import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';

import {
  ConsulterInstallateurDependencies,
  registerConsulterInstallateurQuery,
} from './consulter/consulterInstallateur.query';
import { registerModifierInstallateurCommand } from './modifier/modifierInstallateur.command';
import { registerModifierInstallateurUseCase } from './modifier/modifierInstallateur.usecase';

export type InstallateurQueryDependencies = ConsulterInstallateurDependencies;

export type InstallateurCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerInstallateurUseCases = (dependencies: InstallateurCommandDependencies) => {
  registerModifierInstallateurCommand(dependencies.getProjetAggregateRoot);
  registerModifierInstallateurUseCase();
};

export const registerInstallateurQueries = (dependencies: InstallateurQueryDependencies) => {
  registerConsulterInstallateurQuery(dependencies);
};
