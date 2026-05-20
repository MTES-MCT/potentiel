import { unflatten } from 'flat';

import type { Entity, Joined } from '@potentiel-domain/entity';

import type { KeyValuePair } from './keyValuePair.js';

export const mapResult = <TEntity extends Entity, TJoin extends Entity | Entity[] | undefined>({
  key,
  value,
  join_values,
}: KeyValuePair<TEntity> & { join_values?: { category: string; value: unknown }[] }): TEntity &
  Joined<TJoin> =>
  ({
    ...unflatten<unknown, Omit<TEntity, 'type'>>(value),
    type: key.split('|')[0],
    ...join_values?.reduce(
      (prev, curr) => {
        prev[curr.category] = unflatten(curr.value);
        return prev;
      },
      {} as Record<string, unknown>,
    ),
  }) as TEntity & Joined<TJoin>;
