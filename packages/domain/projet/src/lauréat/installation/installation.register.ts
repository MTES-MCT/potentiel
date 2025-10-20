import {
  ConsulterInstallationDependencies,
  registerConsulterInstallationQuery,
} from './consulter/consulterInstallation.query';
import { ConsulterDispositifDeStockageDependencies } from './dispositif-de-stockage/consulter/consulterDispositifDeStockage.query';
import {
  DispositifDeStockageCommandDependencies,
  registerDispositifDeStockageQueries,
  registerDispositifDeStockageUseCase,
} from './dispositif-de-stockage/dispositifDeStockage.register';
import {
  InstallateurUseCaseDependencies,
  InstallateurQueryDependencies,
  registerInstallateurUseCases,
  registerInstallateurQueries,
} from './installateur/installateur.register';
import {
  ListerHistoriqueInstallationProjetDependencies,
  registerListerHistoriqueInstallationProjetQuery,
} from './listerHistorique/listerHistoriqueInstallationProjet.query';
import {
  registerTypologieInstallationQueries,
  registerTypologieInstallationUseCases,
  TypologieInstallationQueryDependencies,
  TypologieInstallationUseCaseDependencies,
} from './typologie-installation/typologieInstallation.register';

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
