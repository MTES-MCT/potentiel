import { Entity } from '@potentiel-domain/core';

export type KeyValuePair<TEntity extends Entity<TType>, TType extends string = string> = {
  key: `${TType}#${string}`;
  value: Omit<TEntity, 'type'>;
};
