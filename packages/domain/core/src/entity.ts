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

/**
 * @deprecated use ListOptionsV2 instead
 */
export type ListOptions<TEntity extends Entity> = {
  type: TEntity['type'];
  orderBy?: {
    property: keyof TEntity;
    ascending: boolean;
  };
  where?: Partial<TEntity>;
  pagination?: {
    page: number;
    itemsPerPage: number;
  };
};

/**
 * @deprecated use ListResultV2 instead
 */
export type ListResult<TEntity extends Entity> = {
  items: ReadonlyArray<TEntity>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

/**
 * @deprecated use ListV2 instead
 */
export type List = <TEntity extends Entity>(
  options: ListOptions<TEntity>,
) => Promise<ListResult<TEntity>>;

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

export type ListOptionsV2<TEntity extends Entity> = {
  orderBy?: OrderByOptions<Omit<TEntity, 'type'>>;
  range?: RangeOptions;
  where?: WhereOptions<Omit<TEntity, 'type'>>;
};

export type ListResultV2<TEntity extends Entity> = {
  total: number;
  items: ReadonlyArray<TEntity>;
  range: RangeOptions;
};

export type ListV2 = <TEntity extends Entity>(
  category: TEntity['type'],
  options?: ListOptionsV2<TEntity>,
) => Promise<ListResultV2<TEntity>>;

export type CountOption<TEntity extends Entity> = {
  where?: WhereOptions<Omit<TEntity, 'type'>>;
};

export type Count = <TEntity extends Entity>(
  category: TEntity['type'],
  options?: CountOption<TEntity>,
) => Promise<number>;
