import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import {
  ConsulterPériodeDependencies,
  registerConsulterPériodeQuery,
} from './consulter/consulterPériode.query.js';
import {
  ListerPériodesDependencies,
  registerListerPériodesQuery,
} from './lister/listerPériodes.query.js';
import { registerNotifierPériodeCommand } from './notifier/notifierPériode.command.js';
import { registerNotifierPériodeUseCase } from './notifier/notifierPériode.usecase.js';

type PériodeQueryDependencies = ConsulterPériodeDependencies & ListerPériodesDependencies;

type PériodeCommandDependencies = {
  loadAggregate: LoadAggregate;
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerPériodeQueries = (dependencies: PériodeQueryDependencies) => {
  registerConsulterPériodeQuery(dependencies);
  registerListerPériodesQuery(dependencies);
};

export const registerPériodeUseCases = ({
  loadAggregate,
  getProjetAggregateRoot,
}: PériodeCommandDependencies) => {
  registerNotifierPériodeUseCase();
  registerNotifierPériodeCommand(loadAggregate, getProjetAggregateRoot);
};
