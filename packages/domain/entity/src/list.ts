import type { Entity } from './entity';
import type { Joined, JoinOptions } from './joinOptions';
import type { OrderByOptions } from './orderByOptions';
import type { RangeOptions } from './rangeOptions';
import type { WhereOptions } from './whereOptions';

export type ListOptions<TEntity extends Entity, TJoin extends Entity | {} = {}> = {
  orderBy?: OrderByOptions<Omit<TEntity, 'type'>>;
  range?: RangeOptions;
  where?: WhereOptions<Omit<TEntity, 'type'>>;
} & (TJoin extends Entity ? { join: JoinOptions<TEntity, TJoin> } : { join?: undefined });

export type ListResult<TEntity extends Entity, TJoin extends Entity | {} = {}> = {
  total: number;
  items: ReadonlyArray<TEntity & Joined<TJoin>>;
  range: RangeOptions;
};

export type List = <TEntity extends Entity, TJoin extends Entity | {} = {}>(
  category: TEntity['type'],
  options?: ListOptions<TEntity, TJoin>,
) => Promise<ListResult<TEntity, TJoin>>;
