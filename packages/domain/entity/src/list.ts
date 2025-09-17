import { Entity } from './entity';
import { Joined, JoinOptionsParams } from './joinOptions';
import { OrderByOptions } from './orderByOptions';
import { RangeOptions } from './rangeOptions';
import { WhereOptions } from './whereOptions';

export type ListOptions<TEntity extends Entity, TJoin extends Entity | Entity[] | {} = {}> = {
  orderBy?: OrderByOptions<Omit<TEntity, 'type'>>;
  range?: RangeOptions;
  where?: WhereOptions<Omit<TEntity, 'type'>>;
} & JoinOptionsParams<TEntity, TJoin>;

export type ListResult<TEntity extends Entity, TJoin extends Entity | Entity[] | {} = {}> = {
  total: number;
  items: ReadonlyArray<TEntity & Joined<TJoin>>;
  range: RangeOptions;
};

export type List = <TEntity extends Entity, TJoin extends Entity | Entity[] | {} = {}>(
  category: TEntity['type'],
  options?: ListOptions<TEntity, TJoin>,
) => Promise<ListResult<TEntity, TJoin>>;
