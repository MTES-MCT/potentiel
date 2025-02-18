import { Entity } from './entity';
import { JoinOptions } from './joinOptions';
import { OrderByOptions } from './orderByOptions';
import { RangeOptions } from './rangeOptions';
import { WhereOptions } from './whereOptions';

export type ListOptions<TEntity extends Entity, TJoin extends Entity | {} = {}> = {
  orderBy?: OrderByOptions<Omit<TEntity, 'type'>>;
  range?: RangeOptions;
  where?: WhereOptions<Omit<TEntity, 'type'>>;
} & (TJoin extends Entity ? { join: JoinOptions<TEntity, TJoin> } : { join?: undefined });

export type ListResult<TEntity extends Entity> = {
  total: number;
  items: ReadonlyArray<TEntity>;
  range: RangeOptions;
};

export type List = <TEntity extends Entity, TJoin extends Entity | {} = {}>(
  category: TEntity['type'],
  options?: ListOptions<TEntity, TJoin>,
) => Promise<ListResult<TEntity>>;
