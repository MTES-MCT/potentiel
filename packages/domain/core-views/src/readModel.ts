import { Option } from '@potentiel/monads';

/**
 * @deprecated
 */
export type ReadModel<
  TType extends string = string,
  TData extends Record<string, unknown> = {},
> = Readonly<
  TData & {
    type: TType;
  }
>;

/**
 * @deprecated
 */
export type Find = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
) => Promise<Option<TReadModel>>;

/**
 * @deprecated
 */
export type ListOptions<TReadModel extends ReadModel> = {
  type: TReadModel['type'];
  orderBy?: {
    property: keyof TReadModel;
    ascending: boolean;
  };
  where?: Partial<TReadModel>;
  pagination?: {
    page: number;
    itemsPerPage: number;
  };
};

/**
 * @deprecated
 */
export type ListResult<TReadModel extends ReadModel> = {
  items: ReadonlyArray<TReadModel>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

/**
 * @deprecated
 */
export type List = <TReadModel extends ReadModel>(
  options: ListOptions<TReadModel>,
) => Promise<ListResult<TReadModel>>;

/**
 * @deprecated
 */
export type SearchResult<TReadModel extends ReadModel> = {
  key: string;
  readModel: TReadModel;
};

/**
 * @deprecated
 */
export type Search = <TReadModel extends ReadModel>(
  searchKeyExpression: string,
) => Promise<ReadonlyArray<SearchResult<TReadModel>>>;

/**
 * @deprecated
 */
export type Create = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
  readModel: Omit<TReadModel, 'type'>,
) => Promise<void>;

/**
 * @deprecated
 */
export type Update = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
  readModel: Omit<TReadModel, 'type'>,
) => Promise<void>;

/**
 * @deprecated
 */
export type Remove = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
) => Promise<void>;

/**
 * @deprecated
 */
export type Upsert = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
  readModel: Omit<TReadModel, 'type'>,
) => Promise<void>;
