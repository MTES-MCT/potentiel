import type { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port.js';
import {
  type ConsulterChangementDispositifDeStockageDependencies,
  registerConsulterChangementDispositifDeStockageQuery,
} from './changement/consulter/consulterChangementDispositifDeStockage.query.js';
import { registerEnregistrerChangementDispositifDeStockageCommand } from './changement/enregistrer/enregistrerChangementDispositifDeStockage.command.js';
import { registerEnregistrerChangementDispositifDeStockageUseCase } from './changement/enregistrer/enregistrerChangementDispositifDeStockage.usecase.js';
import {
  type ListerChangementDispositifDeStockageDependencies,
  registerListerChangementDispositifDeStockageQuery,
} from './changement/lister/listerChangementDispositifDeStockage.query.js';
import {
  type ConsulterDispositifDeStockageDependencies,
  registerConsulterDispositifDeStockageQuery,
} from './consulter/consulterDispositifDeStockage.query.js';
import { registerModifierDispositifDeStockageCommand } from './modifier/modifierDispositifDeStockage.command.js';
import { registerModifierDispositifDeStockageUseCase } from './modifier/modifierDispositifDeStockage.usecase.js';

export type DispositifDeStockageQueryDependencies = ConsulterDispositifDeStockageDependencies &
  ListerChangementDispositifDeStockageDependencies &
  ConsulterChangementDispositifDeStockageDependencies;

export type DispositifDeStockageCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerDispositifDeStockageQueries = (
  dependencies: DispositifDeStockageQueryDependencies,
) => {
  registerConsulterDispositifDeStockageQuery(dependencies);
  registerConsulterChangementDispositifDeStockageQuery(dependencies);
  registerListerChangementDispositifDeStockageQuery(dependencies);
};

export const registerDispositifDeStockageUseCase = ({
  getProjetAggregateRoot,
}: DispositifDeStockageCommandDependencies) => {
  registerModifierDispositifDeStockageCommand(getProjetAggregateRoot);
  registerModifierDispositifDeStockageUseCase();

  registerEnregistrerChangementDispositifDeStockageCommand(getProjetAggregateRoot);
  registerEnregistrerChangementDispositifDeStockageUseCase();
};
