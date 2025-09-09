import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';

import {
  ConsulterInstallationAvecDispositifDeStockageDependencies,
  registerConsulterInstallationAvecDispositifDeStockageQuery,
} from './consulter/consulterInstallationAvecDispositifDeStockage.query';

export type InstallationAvecDispositifDeStockageQueryDependencies =
  ConsulterInstallationAvecDispositifDeStockageDependencies;

export type InstallationAvecDispositifDeStockageCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerInstallationAvecDispositifDeStockageQueries = (
  dependencies: InstallationAvecDispositifDeStockageQueryDependencies,
) => {
  registerConsulterInstallationAvecDispositifDeStockageQuery(dependencies);
};
