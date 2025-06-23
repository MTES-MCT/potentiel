import { Entity, Joined, JoinOptions } from '@potentiel-domain/entity';
import { unflatten } from '@potentiel-libraries/flat';

import { KeyValuePair } from './keyValuePair';

export const mapResult = <TEntity extends Entity, TJoin extends Entity | {} = {}>(
  { key, value, join_value }: KeyValuePair<TEntity> & { join_value?: string },
  { join }: TJoin extends Entity ? { join: JoinOptions<TEntity, TJoin> } : { join?: undefined },
): TEntity & Joined<TJoin> =>
  ({
    ...unflatten<unknown, Omit<TEntity, 'type'>>(value),
    type: key.split('|')[0],
    ...(join && join_value
      ? { [join.entity]: unflatten<unknown, Omit<TJoin, 'type'>>(join_value) }
      : {}),
  }) as TEntity & Joined<TJoin>;
