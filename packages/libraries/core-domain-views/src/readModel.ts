import { Option } from '@potentiel/monads';

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
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
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export type Find = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
) => Promise<Option<TReadModel>>;

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
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
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export type ListResult<TReadModel extends ReadModel> = {
  items: ReadonlyArray<TReadModel>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export type List = <TReadModel extends ReadModel>(
  options: ListOptions<TReadModel>,
) => Promise<ListResult<TReadModel>>;

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export type SearchResult<TReadModel extends ReadModel> = {
  key: string;
  readModel: TReadModel;
};

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export type Search = <TReadModel extends ReadModel>(
  searchKeyExpression: string,
) => Promise<ReadonlyArray<SearchResult<TReadModel>>>;

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export type Create = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
  readModel: Omit<TReadModel, 'type'>,
) => Promise<void>;

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export type Update = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
  readModel: Omit<TReadModel, 'type'>,
) => Promise<void>;

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export type Remove = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
) => Promise<void>;

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export type Upsert = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
  readModel: Omit<TReadModel, 'type'>,
) => Promise<void>;
