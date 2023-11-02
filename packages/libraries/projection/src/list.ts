import { Projection } from './projection';

export type ListOptions<TProjection extends Projection> = {
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
export type ListResult<TProjection extends Projection> = {
  items: ReadonlyArray<TProjection>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

export type List = <TProjection extends Projection>(
  options: ListOptions<TProjection>,
) => Promise<ListResult<TProjection>>;
