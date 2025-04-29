import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registerImporterProducteurCommand } from './importer/importerProducteur.command';

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
