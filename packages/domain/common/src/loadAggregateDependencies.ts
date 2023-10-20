import { Publish, LoadAggregate } from '@potentiel-domain/core';

export type LoadAggregateDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};
