import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registerImporterProducteurCommand } from './importer/importerProducteur.command';
import {
  ConsulterProducteurDependencies,
  registerConsulterProducteurQuery,
} from './consulter/consulterProducteur.query';
import { registerEnregistrerChangementProducteurCommand } from './changement/enregistrerChangement/enregistrerChangementProducteur.command';
import { registerEnregistrerChangementProducteurUseCase } from './changement/enregistrerChangement/enregistrerChangementProducteur.usecase';
import {
  ConsulterChangementProducteurDependencies,
  registerConsulterChangementProducteurQuery,
} from './changement/consulter/consulterChangementProducteur.query';

export type ProducteurQueryDependencies = ConsulterProducteurDependencies &
  ConsulterChangementProducteurDependencies;

export type ProducteurCommandDependencies = {
  loadAggregate: LoadAggregate;
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerProducteurUseCases = ({
  loadAggregate,
  getProjetAggregateRoot,
}: ProducteurCommandDependencies) => {
  registerEnregistrerChangementProducteurUseCase();

  registerImporterProducteurCommand(loadAggregate, getProjetAggregateRoot);
  registerEnregistrerChangementProducteurCommand(loadAggregate, getProjetAggregateRoot);
};

export const registerProducteurQueries = (dependencies: ProducteurQueryDependencies) => {
  registerConsulterProducteurQuery(dependencies);
  registerConsulterChangementProducteurQuery(dependencies);
};
