import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';

import {
  ConsulterChangementInstallateurDependencies,
  registerConsulterChangementInstallateurQuery,
} from './changement/consulter/consulterChangementInstallateur.query';
import { registerEnregistrerChangementInstallateurCommand } from './changement/enregistrerChangement/enregistrerChangementInstallateur.command';
import { registerEnregistrerChangementInstallateurUseCase } from './changement/enregistrerChangement/enregistrerChangementInstallateur.usecase';
import {
  ListerChangementInstallateurDependencies,
  registerListerChangementInstallateurQuery,
} from './changement/lister/listerChangementInstallateur.query';
import {
  ConsulterInstallateurDependencies,
  registerConsulterInstallateurQuery,
} from './consulter/consulterInstallateur.query';
import { registerModifierInstallateurCommand } from './modifier/modifierInstallateur.command';
import { registerModifierInstallateurUseCase } from './modifier/modifierInstallateur.usecase';

export type InstallateurQueryDependencies = ConsulterInstallateurDependencies &
  ConsulterChangementInstallateurDependencies &
  ListerChangementInstallateurDependencies;

export type InstallateurUseCaseDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerInstallateurUseCases = (dependencies: InstallateurUseCaseDependencies) => {
  registerModifierInstallateurCommand(dependencies.getProjetAggregateRoot);
  registerModifierInstallateurUseCase();
  registerEnregistrerChangementInstallateurCommand(dependencies.getProjetAggregateRoot);
  registerEnregistrerChangementInstallateurUseCase();
};

export const registerInstallateurQueries = (dependencies: InstallateurQueryDependencies) => {
  registerConsulterInstallateurQuery(dependencies);
  registerConsulterChangementInstallateurQuery(dependencies);
  registerListerChangementInstallateurQuery(dependencies);
};
