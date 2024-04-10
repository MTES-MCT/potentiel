import { Entity, ListOptionsV2, ListResultV2 } from '@potentiel-domain/core';
import { executeSelect } from '@potentiel-librairies/pg-helpers';
import { KeyValuePair } from './keyValuePair';
import { unflatten } from '@potentiel-librairies/flat-cjs';

const selectQuery = 'select key, value from domain_views.projection where key like $1';

export const listProjectionV2 = async <TEntity extends Entity>({
  type,
}: ListOptionsV2<TEntity>): Promise<ListResultV2<TEntity>> => {
  const result = await executeSelect<KeyValuePair<TEntity>>(selectQuery, `${type}|%`);
  return {
    items: result.map(
      ({ key, value }) =>
        ({
          ...unflatten<unknown, Omit<TEntity, 'type'>>(value),
          type: key.split('|')[0],
        } as TEntity),
    ),
  };
};
