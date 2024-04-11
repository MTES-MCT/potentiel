import { Option } from '@potentiel-librairies/monads';

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

export type OrderByOptions<TType> = {
  [TProperty in keyof TType]?: TType[TProperty] extends string | boolean | number
    ? Order
    : TType[TProperty] extends Record<string, infer U>
    ? OrderByOptions<TType[TProperty]>
    : never;
};

export type LimitOptions = {
  offset: number;
  next: number;
};

export type WhereOptions<TType> = {
  [TProperty in keyof TType]?: TType[TProperty] extends string | boolean | number
    ? TType[TProperty]
    : TType[TProperty] extends Record<string, infer U>
    ? WhereOptions<TType[TProperty]>
    : never;
};

export type ListOptionsV2<TEntity extends Entity> = {
  orderBy?: OrderByOptions<Omit<TEntity, 'type'>>;
  limit?: LimitOptions;
  where?: WhereOptions<Omit<TEntity, 'type'>>;
};

export type ListResultV2<TEntity extends Entity> = {
  total: number;
  items: ReadonlyArray<TEntity>;
};

export type ListV2 = <TEntity extends Entity>(
  category: TEntity['type'],
  options?: ListOptionsV2<TEntity>,
) => Promise<ListResultV2<TEntity>>;
