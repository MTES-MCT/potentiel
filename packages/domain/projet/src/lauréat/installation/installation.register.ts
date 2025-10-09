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

export type InstallationQueryDependencies =
  | InstallateurQueryDependencies
  | ConsulterInstallationDependencies;

export type InstallationUseCasesDependencies = InstallateurUseCaseDependencies;

export const registerInstallationUseCases = (dependencies: InstallationUseCasesDependencies) => {
  registerInstallateurUseCases(dependencies);
};

export const registerInstallationQueries = (dependencies: InstallationQueryDependencies) => {
  registerInstallateurQueries(dependencies);
  registerConsulterInstallationQuery(dependencies);
};
