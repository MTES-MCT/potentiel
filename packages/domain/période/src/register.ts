import type { LoadAggregate } from '@potentiel-domain/core';
import type { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import {
  type ConsulterPériodeDependencies,
  registerConsulterPériodeQuery,
} from './consulter/consulterPériode.query.js';
import {
  type ListerPériodesDependencies,
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
