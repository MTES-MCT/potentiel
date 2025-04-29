import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registerImporterProducteurCommand } from './importer/importerProducteur.command';
import {
  ConsulterProducteurDependencies,
  registerConsulterProducteurQuery,
} from './consulter/consulterProducteur.query';

export type ProducteurQueryDependencies = ConsulterProducteurDependencies;

export type ProducteurCommandDependencies = {
  loadAggregate: LoadAggregate;
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerProducteurUseCases = ({
  loadAggregate,
  getProjetAggregateRoot,
}: ProducteurCommandDependencies) => {
  registerImporterProducteurCommand(loadAggregate, getProjetAggregateRoot);
};

export const registerProducteurQueries = (dependencies: ProducteurQueryDependencies) => {
  registerConsulterProducteurQuery(dependencies);
};
