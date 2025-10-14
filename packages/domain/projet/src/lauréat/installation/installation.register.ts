import {
  ConsulterInstallationDependencies,
  registerConsulterInstallationQuery,
} from './consulter/consulterInstallation.query';
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
  registerTypologieDuProjetQueries,
  registerTypologieDuProjetUseCases,
  TypologieDuProjetQueryDependencies,
  TypologieDuProjetUseCaseDependencies,
} from './typologie-du-projet/typologieDuProjet.register';

export type InstallationQueryDependencies = TypologieDuProjetQueryDependencies &
  InstallateurQueryDependencies &
  ConsulterInstallationDependencies &
  ListerHistoriqueInstallationProjetDependencies;

export type InstallationUseCasesDependencies = TypologieDuProjetUseCaseDependencies &
  InstallateurUseCaseDependencies;

export const registerInstallationQueries = (dependencies: InstallationQueryDependencies) => {
  registerTypologieDuProjetQueries(dependencies);
  registerInstallateurQueries(dependencies);
  registerConsulterInstallationQuery(dependencies);
  registerListerHistoriqueInstallationProjetQuery(dependencies);
};

export const registerInstallationUseCases = (dependencies: InstallationUseCasesDependencies) => {
  registerInstallateurUseCases(dependencies);
  registerTypologieDuProjetUseCases(dependencies);
};
