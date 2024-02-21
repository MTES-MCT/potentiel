import { Option } from '@potentiel/monads';

export type Entity<
  TType extends string = string,
  TData extends Record<string, unknown> = {},
> = Readonly<
  TData & {
    type: TType;
  }
>;

export type Find = <TProjection extends Entity>(
  id: `${TProjection['type']}|${string}`,
) => Promise<Option<TProjection>>;

export type ListOptions<TProjection extends Entity> = {
  type: TProjection['type'];
  orderBy?: {
    property: keyof TProjection;
    ascending: boolean;
  };
  where?: Partial<TProjection>;
  pagination?: {
    page: number;
    itemsPerPage: number;
  };
};
export type ListResult<TProjection extends Entity> = {
  items: ReadonlyArray<TProjection>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

export type List = <TProjection extends Entity>(
  options: ListOptions<TProjection>,
) => Promise<ListResult<TProjection>>;
