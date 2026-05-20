import type { Entity } from './entity.js';
import type { Joined, JoinOptionsParams } from './joinOptions.js';
import type { OrderByOptions } from './orderByOptions.js';
import type { RangeOptions } from './rangeOptions.js';
import type { SelectOptions } from './selectOptions.js';
import type { WhereOptions } from './whereOptions.js';

export type ListOptions<
  TEntity extends Entity,
  TJoin extends Entity | Entity[] | Record<never, never> = Record<never, never>,
> = {
  orderBy?: OrderByOptions<Omit<TEntity, 'type'>>;
  range?: RangeOptions;
  where?: WhereOptions<Omit<TEntity, 'type'>>;
  select?: SelectOptions<Omit<TEntity, 'type'>>;
} & JoinOptionsParams<TEntity, TJoin>;

export type ListResult<
  TEntity extends Entity,
  TJoin extends Entity | Entity[] | Record<never, never> = Record<never, never>,
> = {
  total: number;
  items: ReadonlyArray<TEntity & Joined<TJoin>>;
  range: RangeOptions;
};

export type List = <
  TEntity extends Entity,
  TJoin extends Entity | Entity[] | Record<never, never> = Record<never, never>,
>(
  category: TEntity['type'],
  options?: ListOptions<TEntity, TJoin>,
) => Promise<ListResult<TEntity, TJoin>>;
