import { LoadAggregate } from '@potentiel-domain/core';

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

type PériodeCommandDependencies = { loadAggregate: LoadAggregate };

export const registerPériodeQueries = (dependencies: PériodeQueryDependencies) => {
  registerConsulterPériodeQuery(dependencies);
  registerListerPériodesQuery(dependencies);
};

export const registerPériodeUseCases = ({ loadAggregate }: PériodeCommandDependencies) => {
  registerNotifierPériodeUseCase();
  registerNotifierPériodeCommand(loadAggregate);
};
