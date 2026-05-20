import type { Option } from '@potentiel-libraries/monads';

import type { Entity } from './entity.js';
import type { Joined, JoinOptionsParams } from './joinOptions.js';
import type { SelectOptions } from './selectOptions.js';

export type FindOptions<
  TEntity extends Entity,
  TJoin extends Entity | Entity[] | undefined = undefined,
> = {
  select?: SelectOptions<Omit<TEntity, 'type'>>;
} & JoinOptionsParams<TEntity, TJoin>;

export type Find = <
  TEntity extends Entity,
  TJoin extends Entity | Entity[] | undefined = undefined,
>(
  id: `${TEntity['type']}|${string}`,
  options?: FindOptions<TEntity, TJoin>,
) => Promise<Option.Type<TEntity & Joined<TJoin>>>;
