import {
  ConsulterPériodeDependencies,
  registerConsulterPériodeQuery,
} from './consulter/consulterPériode.query';
import { registerNotifierPériodeUseCase } from './notifier/notifierPériode.usecase';

type PériodeQueryDependencies = ConsulterPériodeDependencies;

export const registerPériodeQueries = (dependencies: PériodeQueryDependencies) => {
  registerConsulterPériodeQuery(dependencies);
};

export const registerPériodeUseCases = () => {
  registerNotifierPériodeUseCase();
};
