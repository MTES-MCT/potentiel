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
  registerTypologieInstallationQueries,
  registerTypologieInstallationUseCases,
  TypologieInstallationQueryDependencies,
  TypologieInstallationUseCaseDependencies,
} from './typologie-installation/typologieInstallation.register';

export type InstallationQueryDependencies = TypologieInstallationQueryDependencies &
  InstallateurQueryDependencies &
  ConsulterInstallationDependencies;

export type InstallationUseCasesDependencies = TypologieInstallationUseCaseDependencies &
  InstallateurUseCaseDependencies;

export const registerInstallationQueries = (dependencies: InstallationQueryDependencies) => {
  registerTypologieInstallationQueries(dependencies);
  registerInstallateurQueries(dependencies);
  registerConsulterInstallationQuery(dependencies);
};

export const registerInstallationUseCases = (dependencies: InstallationUseCasesDependencies) => {
  registerInstallateurUseCases(dependencies);
  registerTypologieInstallationUseCases(dependencies);
};
