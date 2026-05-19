import type { Entity } from './entity.js';
import type { JoinOptionsParams } from './joinOptions.js';
import type { WhereOptions } from './whereOptions.js';

export type CountOption<
  TEntity extends Entity,
  TJoin extends Entity | Entity[] | object = object,
> = {
  where?: WhereOptions<Omit<TEntity, 'type'>>;
} & JoinOptionsParams<TEntity, TJoin>;

export type Count = <TEntity extends Entity, TJoin extends Entity | Entity[] | object = object>(
  category: TEntity['type'],
  options?: CountOption<TEntity, TJoin>,
) => Promise<number>;
