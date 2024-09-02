import { LoadAggregate } from '@potentiel-domain/core';

import {
  ConsulterPériodeDependencies,
  registerConsulterPériodeQuery,
} from './consulter/consulterPériode.query';
import { registerNotifierPériodeCommand } from './notifier/notifierPériode.command';
import { registerNotifierPériodeUseCase } from './notifier/notifierPériode.usecase';

type PériodeQueryDependencies = ConsulterPériodeDependencies;

type PériodeCommandDependencies = { loadAggregate: LoadAggregate };

export const registerPériodeQueries = (dependencies: PériodeQueryDependencies) => {
  registerConsulterPériodeQuery(dependencies);
};

export const registerPériodeUseCases = ({ loadAggregate }: PériodeCommandDependencies) => {
  registerNotifierPériodeUseCase();
  registerNotifierPériodeCommand(loadAggregate);
};
