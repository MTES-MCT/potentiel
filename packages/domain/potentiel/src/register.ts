import { LoadAggregate, Publish } from '@potentiel-domain/core';
import { LauréatDependencies, registerLauréatUseCases } from './lauréat/lauréat.register';

type DomainUseCasesDependencies = {
  common: {
    publish: Publish;
    loadAggregate: LoadAggregate;
  };
  lauréat: Omit<LauréatDependencies, keyof DomainUseCasesDependencies['common']>;
};

export const registerUseCases = ({ common, lauréat }: DomainUseCasesDependencies) => {
  registerLauréatUseCases({
    ...common,
    ...lauréat,
  });
};
