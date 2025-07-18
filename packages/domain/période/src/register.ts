import { LoadAggregateV2 } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import {
  ConsulterPériodeDependencies,
  registerConsulterPériodeQuery,
} from './consulter/consulterPériode.query';
import {
  ListerPériodesDependencies,
  registerListerPériodesQuery,
} from './lister/listerPériode.query';
import { registerNotifierPériodeCommand } from './notifier/notifierPériode.command';
import { registerNotifierPériodeUseCase } from './notifier/notifierPériode.usecase';

type PériodeQueryDependencies = ConsulterPériodeDependencies & ListerPériodesDependencies;

type PériodeCommandDependencies = {
  loadAggregate: LoadAggregateV2;
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
