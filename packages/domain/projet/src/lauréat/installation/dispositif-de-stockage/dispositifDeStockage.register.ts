import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';

import {
  ConsulterDispositifDeStockageDependencies,
  registerConsulterDispositifDeStockageQuery,
} from './consulter/consulterDispositifDeStockage.query';
import { registerModifierDispositifDeStockageCommand } from './modifier/modifierDispositifDeStockage.command';
import { registerModifierDispositifDeStockageUseCase } from './modifier/modifierDispositifDeStockage.usecase';

export type DispositifDeStockageQueryDependencies = ConsulterDispositifDeStockageDependencies;

export type DispositifDeStockageCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerDispositifDeStockageQueries = (
  dependencies: DispositifDeStockageQueryDependencies,
) => {
  registerConsulterDispositifDeStockageQuery(dependencies);
};

export const registerDispositifDeStockageUseCase = ({
  getProjetAggregateRoot,
}: DispositifDeStockageCommandDependencies) => {
  registerModifierDispositifDeStockageCommand(getProjetAggregateRoot);
  registerModifierDispositifDeStockageUseCase();
};
