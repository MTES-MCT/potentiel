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

type OrderByOptions<TEntity extends Entity> = {};

export type ListOptionsV2<TEntity extends Entity> = {
  type: TEntity['type'];
  orderBy: OrderByOptions<TEntity>;
};

export type ListResultV2<TEntity extends Entity> = {
  items: ReadonlyArray<TEntity>;
};

export type ListV2 = <TEntity extends Entity>(
  options: ListOptionsV2<TEntity>,
) => Promise<ListResultV2<TEntity>>;
