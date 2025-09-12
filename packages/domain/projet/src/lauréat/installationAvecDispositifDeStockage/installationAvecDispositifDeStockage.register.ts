import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';

import {
  ConsulterInstallationAvecDispositifDeStockageDependencies,
  registerConsulterInstallationAvecDispositifDeStockageQuery,
} from './consulter/consulterInstallationAvecDispositifDeStockage.query';
import {
  ListerHistoriqueInstallationAvecDispositifDeStockageProjetDependencies,
  registerListerHistoriqueInstallationAvecDispositifDeStockageProjetQuery,
} from './listerHistorique/ListerHistoriqueInstallationAvecDispositifDeStockageProjet.query';
import { registerModifierInstallationAvecDispositifDeStockageCommand } from './modifier/modifierInstallationAvecDispositifDeStockage.command';
import { registerModifierInstallationAvecDispositifDeStockageUseCase } from './modifier/modifierInstallationAvecDispositifDeStockage.usecase';

export type InstallationAvecDispositifDeStockageQueryDependencies =
  ConsulterInstallationAvecDispositifDeStockageDependencies &
    ListerHistoriqueInstallationAvecDispositifDeStockageProjetDependencies;

export type InstallationAvecDispositifDeStockageCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerInstallationAvecDispositifDeStockageQueries = (
  dependencies: InstallationAvecDispositifDeStockageQueryDependencies,
) => {
  registerConsulterInstallationAvecDispositifDeStockageQuery(dependencies);
  registerListerHistoriqueInstallationAvecDispositifDeStockageProjetQuery(dependencies);
};

export const registerInstallationAvecDispositifDeStockageUseCase = ({
  getProjetAggregateRoot,
}: InstallationAvecDispositifDeStockageCommandDependencies) => {
  registerModifierInstallationAvecDispositifDeStockageCommand(getProjetAggregateRoot);
  registerModifierInstallationAvecDispositifDeStockageUseCase();
};
