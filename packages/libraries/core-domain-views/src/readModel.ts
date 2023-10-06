import { Option } from '@potentiel/monads';

export type ReadModel<
  TType extends string = string,
  TData extends Record<string, unknown> = {},
> = Readonly<
  TData & {
    type: TType;
  }
>;

export type Find = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
) => Promise<Option<TReadModel>>;

export type ListOptions<TReadModel extends ReadModel> = {
  type: TReadModel['type'];
  orderBy?: keyof TReadModel;
  where?: Partial<TReadModel>;
  pagination?: {
    page: number;
    itemsPerPage: number;
  };
};
export type ListResult<TReadModel extends ReadModel> = {
  items: ReadonlyArray<TReadModel>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

export type List = <TReadModel extends ReadModel>(
  options: ListOptions<TReadModel>,
) => Promise<ListResult<TReadModel>>;

export type SearchResult<TReadModel extends ReadModel> = {
  key: string;
  readModel: TReadModel;
};

export type Search = <TReadModel extends ReadModel>(
  searchKeyExpression: string,
) => Promise<ReadonlyArray<SearchResult<TReadModel>>>;

export type Create = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
  readModel: Omit<TReadModel, 'type'>,
) => Promise<void>;

export type Update = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
  readModel: Omit<TReadModel, 'type'>,
) => Promise<void>;

export type Remove = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
) => Promise<void>;

export type Upsert = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
  readModel: Omit<TReadModel, 'type'>,
) => Promise<void>;
