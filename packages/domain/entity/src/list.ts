import { Entity } from './entity';
import { Joined, JoinOptions } from './joinOptions';
import { OrderByOptions } from './orderByOptions';
import { RangeOptions } from './rangeOptions';
import { WhereOptions } from './whereOptions';

export type ListOptions<
  TEntity extends Entity,
  TJoin extends Entity | {} = {},
  TJoin2 extends Entity | {} = {},
> = {
  orderBy?: OrderByOptions<Omit<TEntity, 'type'>>;
  range?: RangeOptions;
  where?: WhereOptions<Omit<TEntity, 'type'>>;
} & (TJoin extends Entity
  ? TJoin2 extends Entity
    ? { join: [JoinOptions<TEntity, TJoin>, JoinOptions<TEntity, TJoin2>] }
    : { join: JoinOptions<TEntity, TJoin> }
  : { join?: undefined });

export type ListResult<
  TEntity extends Entity,
  TJoin extends Entity | {} = {},
  TJoin2 extends Entity | {} = {},
> = {
  total: number;
  items: ReadonlyArray<TEntity & Joined<TJoin> & Joined<TJoin2>>;
  range: RangeOptions;
};

export type List = <
  TEntity extends Entity,
  TJoin extends Entity | {} = {},
  TJoin2 extends Entity | {} = {},
>(
  category: TEntity['type'],
  options?: ListOptions<TEntity, TJoin, TJoin2>,
) => Promise<ListResult<TEntity, TJoin, TJoin2>>;
