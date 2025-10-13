import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';

import {
  ConsulterInstallateurDependencies,
  registerConsulterInstallateurQuery,
} from './consulter/consulterInstallateur.query';
import {
  ListerHistoriqueInstallateurProjetDependencies,
  registerListerHistoriqueInstallateurProjetQuery,
} from './listerHistorique/listerHistoriqueInstallateurProjet.query';
import { registerModifierInstallateurCommand } from './modifier/modifierInstallateur.command';
import { registerModifierInstallateurUseCase } from './modifier/modifierInstallateur.usecase';

export type InstallateurQueryDependencies = ConsulterInstallateurDependencies &
  ListerHistoriqueInstallateurProjetDependencies;

export type InstallateurUseCaseDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerInstallateurUseCases = (dependencies: InstallateurUseCaseDependencies) => {
  registerModifierInstallateurCommand(dependencies.getProjetAggregateRoot);
  registerModifierInstallateurUseCase();
};

export const registerInstallateurQueries = (dependencies: InstallateurQueryDependencies) => {
  registerConsulterInstallateurQuery(dependencies);
  registerListerHistoriqueInstallateurProjetQuery(dependencies);
};
