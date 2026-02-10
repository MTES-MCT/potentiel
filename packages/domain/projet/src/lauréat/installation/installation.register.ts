import {
  ConsulterInstallationDependencies,
  registerConsulterInstallationQuery,
} from './consulter/consulterInstallation.query.js';
import { ConsulterDispositifDeStockageDependencies } from './dispositif-de-stockage/consulter/consulterDispositifDeStockage.query.js';
import {
  DispositifDeStockageCommandDependencies,
  registerDispositifDeStockageQueries,
  registerDispositifDeStockageUseCase,
} from './dispositif-de-stockage/dispositifDeStockage.register.js';
import {
  InstallateurUseCaseDependencies,
  InstallateurQueryDependencies,
  registerInstallateurUseCases,
  registerInstallateurQueries,
} from './installateur/installateur.register.js';
import {
  ListerHistoriqueInstallationProjetDependencies,
  registerListerHistoriqueInstallationProjetQuery,
} from './listerHistorique/listerHistoriqueInstallationProjet.query.js';
import {
  registerTypologieInstallationQueries,
  registerTypologieInstallationUseCases,
  TypologieInstallationQueryDependencies,
  TypologieInstallationUseCaseDependencies,
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
