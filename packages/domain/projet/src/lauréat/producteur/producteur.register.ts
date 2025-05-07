import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';

import {
  ConsulterChangementProducteurDependencies,
  registerConsulterChangementProducteurQuery,
} from './changement/consulter/consulterChangementProducteur.query';
import { registerEnregistrerChangementProducteurCommand } from './changement/enregistrerChangement/enregistrerChangement.command';
import { registerEnregistrerChangementProducteurUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase';
import {
  ListerChangementProducteurDependencies,
  registerListerChangementProducteurQuery,
} from './changement/lister/listerChangementProducteur.query';
import {
  ConsulterProducteurDependencies,
  registerConsulterProducteurQuery,
} from './consulter/consulterProducteur.query';

export type ProducteurQueryDependencies = ConsulterProducteurDependencies &
  ConsulterChangementProducteurDependencies &
  ListerChangementProducteurDependencies;

export type ProducteurCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerProducteurUseCases = ({
  getProjetAggregateRoot,
}: ProducteurCommandDependencies) => {
  registerEnregistrerChangementProducteurCommand(getProjetAggregateRoot);
  registerEnregistrerChangementProducteurUseCase();
};

export const registerProducteurQueries = (dependencies: ProducteurQueryDependencies) => {
  registerConsulterProducteurQuery(dependencies);
  registerConsulterChangementProducteurQuery(dependencies);
  registerListerChangementProducteurQuery(dependencies);
};
