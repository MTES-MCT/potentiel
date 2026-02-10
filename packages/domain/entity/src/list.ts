import { Entity } from './entity.js';
import { Joined, JoinOptionsParams } from './joinOptions.js';
import { OrderByOptions } from './orderByOptions.js';
import { RangeOptions } from './rangeOptions.js';
import { SelectOptions } from './selectOptions.js';
import { WhereOptions } from './whereOptions.js';

export type ListOptions<TEntity extends Entity, TJoin extends Entity | Entity[] | {} = {}> = {
  orderBy?: OrderByOptions<Omit<TEntity, 'type'>>;
  range?: RangeOptions;
  where?: WhereOptions<Omit<TEntity, 'type'>>;
  select?: SelectOptions<Omit<TEntity, 'type'>>;
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
