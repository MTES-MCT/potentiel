import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';

import {
  ConsulterChangementDispositifDeStockageDependencies,
  registerConsulterChangementDispositifDeStockageQuery,
} from './changement/consulter/consulterChangementDispositifDeStockage.query';
import { registerEnregistrerChangementDispositifDeStockageCommand } from './changement/enregistrer/enregistrerChangementDispositifDeStockage.command';
import { registerEnregistrerChangementDispositifDeStockageUseCase } from './changement/enregistrer/enregistrerChangementDispositifDeStockage.usecase';
import {
  ListerChangementDispositifDeStockageDependencies,
  registerListerChangementDispositifDeStockageQuery,
} from './changement/lister/listerChangementDispositifDeStockage.query';
import {
  ConsulterDispositifDeStockageDependencies,
  registerConsulterDispositifDeStockageQuery,
} from './consulter/consulterDispositifDeStockage.query';
import { registerModifierDispositifDeStockageCommand } from './modifier/modifierDispositifDeStockage.command';
import { registerModifierDispositifDeStockageUseCase } from './modifier/modifierDispositifDeStockage.usecase';

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
