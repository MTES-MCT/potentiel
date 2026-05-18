import {
  type ConsulterInstallationDependencies,
  registerConsulterInstallationQuery,
} from './consulter/consulterInstallation.query.js';
import type { ConsulterDispositifDeStockageDependencies } from './dispositif-de-stockage/consulter/consulterDispositifDeStockage.query.js';
import {
  type DispositifDeStockageCommandDependencies,
  registerDispositifDeStockageQueries,
  registerDispositifDeStockageUseCase,
} from './dispositif-de-stockage/dispositifDeStockage.register.js';
import {
  type InstallateurQueryDependencies,
  type InstallateurUseCaseDependencies,
  registerInstallateurQueries,
  registerInstallateurUseCases,
} from './installateur/installateur.register.js';
import {
  type ListerHistoriqueInstallationProjetDependencies,
  registerListerHistoriqueInstallationProjetQuery,
} from './listerHistorique/listerHistoriqueInstallationProjet.query.js';
import {
  registerTypologieInstallationQueries,
  registerTypologieInstallationUseCases,
  type TypologieInstallationQueryDependencies,
  type TypologieInstallationUseCaseDependencies,
} from './typologie-installation/typologieInstallation.register.js';

export type InstallationQueryDependencies = TypologieInstallationQueryDependencies &
  InstallateurQueryDependencies &
  ConsulterInstallationDependencies &
  ConsulterDispositifDeStockageDependencies &
  ListerHistoriqueInstallationProjetDependencies;

export type InstallationUseCasesDependencies = TypologieInstallationUseCaseDependencies &
  InstallateurUseCaseDependencies &
  DispositifDeStockageCommandDependencies;

export const registerInstallationQueries = (dependencies: InstallationQueryDependencies) => {
  registerTypologieInstallationQueries(dependencies);
  registerInstallateurQueries(dependencies);
  registerConsulterInstallationQuery(dependencies);
  registerListerHistoriqueInstallationProjetQuery(dependencies);
  registerDispositifDeStockageQueries(dependencies);
};

export const registerInstallationUseCases = (dependencies: InstallationUseCasesDependencies) => {
  registerInstallateurUseCases(dependencies);
  registerTypologieInstallationUseCases(dependencies);
  registerDispositifDeStockageUseCase(dependencies);
};
