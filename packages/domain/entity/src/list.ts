import { Entity } from './entity';
import { OrderByOptions } from './orderByOptions';
import { RangeOptions } from './rangeOptions';
import { WhereOptions } from './whereOptions';

export type ListOptions<TEntity extends Entity> = {
  orderBy?: OrderByOptions<Omit<TEntity, 'type'>>;
  range?: RangeOptions;
  where?: WhereOptions<Omit<TEntity, 'type'>>;
};

export type ListResult<TEntity extends Entity> = {
  total: number;
  items: ReadonlyArray<TEntity>;
  range: RangeOptions;
};

export type List = <TEntity extends Entity>(
  category: TEntity['type'],
  options?: ListOptions<TEntity>,
) => Promise<ListResult<TEntity>>;
