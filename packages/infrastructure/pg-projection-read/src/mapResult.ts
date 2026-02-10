import { unflatten } from 'flat';

import { Entity, Joined } from '@potentiel-domain/entity';

import { KeyValuePair } from './keyValuePair.js';

export const mapResult = <TEntity extends Entity, TJoin extends Entity | {}>({
  key,
  value,
  join_values,
}: KeyValuePair<TEntity> & { join_values?: { category: string; value: unknown }[] }): TEntity &
  Joined<TJoin> =>
  ({
    ...unflatten<unknown, Omit<TEntity, 'type'>>(value),
    type: key.split('|')[0],
    ...join_values?.reduce((prev, curr) => {
      return { ...prev, [curr.category]: unflatten<unknown, Omit<TJoin, 'type'>>(curr.value) };
    }, {}),
  }) as TEntity & Joined<TJoin>;
