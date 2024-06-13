import { Option } from '@potentiel-libraries/monads';

export type Entity<
  TType extends string = string,
  TData extends Record<string, unknown> = {},
> = Readonly<
  TData & {
    type: TType;
  }
>;

export type Find = <TEntity extends Entity>(
  id: `${TEntity['type']}|${string}`,
) => Promise<Option.Type<TEntity>>;

export type Order = 'ascending' | 'descending';

export type OrderByOptions<T> = {
  [P in keyof T]?: T[P] extends string | boolean | number
    ? Order
    : T[P] extends Record<string, infer U>
    ? OrderByOptions<T[P]>
    : never;
};

export type RangeOptions = {
  startPosition: number;
  endPosition: number;
};

export type EqualWhereCondition<T> = { operator: 'equal'; value: T };
export type NotEqualWhereCondition<T> = { operator: 'notEqual'; value: T };

export type IncludeWhereCondition<T> = { operator: 'include'; value: Array<T> };
export type NotIncludeWhereCondition<T> = { operator: 'notInclude'; value: Array<T> };

export type LikeWhereCondition = {
  operator: 'like';
  value: `%${string}` | `${string}%` | `%${string}%`;
};
export type NotLikeWhereCondition = {
  operator: 'notLike';
  value: `%${string}` | `${string}%` | `%${string}%`;
};

export type WhereCondition<T = {}> =
  | EqualWhereCondition<T>
  | NotEqualWhereCondition<T>
  | LikeWhereCondition
  | NotLikeWhereCondition
  | IncludeWhereCondition<T>
  | NotIncludeWhereCondition<T>;

export type WhereOperator = WhereCondition['operator'];

export type WhereOptions<T> = {
  [P in keyof T]?: T[P] extends string | boolean | number
    ? WhereCondition<T[P]>
    : T[P] extends Record<string, infer U> | undefined
    ? WhereOptions<T[P]>
    : never;
};

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

export type CountOption<TEntity extends Entity> = {
  where?: WhereOptions<Omit<TEntity, 'type'>>;
};

export type Count = <TEntity extends Entity>(
  category: TEntity['type'],
  options?: CountOption<TEntity>,
) => Promise<number>;
