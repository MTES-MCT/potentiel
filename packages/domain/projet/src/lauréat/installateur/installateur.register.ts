import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';

import {
  ConsulterInstallateurDependencies,
  registerConsulterInstallateurQuery,
} from './consulter/consulterInstallateur.query';

export type InstallateurQueryDependencies = ConsulterInstallateurDependencies;

export type InstallateurCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerInstallateurQueries = (dependencies: InstallateurQueryDependencies) => {
  registerConsulterInstallateurQuery(dependencies);
};
