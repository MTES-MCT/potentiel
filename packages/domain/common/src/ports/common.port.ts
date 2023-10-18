import { Option } from '@potentiel/monads';
import { ReadModel } from '@potentiel-domain/core';

export type Find = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
) => Promise<Option<TReadModel>>;

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
