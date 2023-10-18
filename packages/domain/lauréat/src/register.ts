import { AbandonDependencies, registerAbandonUseCases } from './abandon/abandon.register';

export type LauréatDependencies = AbandonDependencies;

export const registerLauréatUseCases = (dependencies: LauréatDependencies) => {
  registerAbandonUseCases(dependencies);
};
