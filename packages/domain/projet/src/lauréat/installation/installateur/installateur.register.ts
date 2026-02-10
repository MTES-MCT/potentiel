import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port.js';

import {
  ConsulterChangementInstallateurDependencies,
  registerConsulterChangementInstallateurQuery,
} from './changement/consulter/consulterChangementInstallateur.query.js';
import { registerEnregistrerChangementInstallateurCommand } from './changement/enregistrerChangement/enregistrerChangementInstallateur.command.js';
import { registerEnregistrerChangementInstallateurUseCase } from './changement/enregistrerChangement/enregistrerChangementInstallateur.usecase.js';
import {
  ListerChangementInstallateurDependencies,
  registerListerChangementInstallateurQuery,
} from './changement/lister/listerChangementInstallateur.query.js';
import {
  ConsulterInstallateurDependencies,
  registerConsulterInstallateurQuery,
} from './consulter/consulterInstallateur.query.js';
import { registerModifierInstallateurCommand } from './modifier/modifierInstallateur.command.js';
import { registerModifierInstallateurUseCase } from './modifier/modifierInstallateur.usecase.js';

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
