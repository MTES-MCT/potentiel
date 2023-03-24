import { ReadModel } from './readModel';

type QueryResult<TReadModel> = TReadModel extends Array<infer U extends ReadModel>
  ? Array<U>
  : TReadModel extends ReadonlyArray<infer U extends ReadModel>
  ? ReadonlyArray<U>
  : TReadModel extends ReadModel
  ? TReadModel
  : never;

export type QueryHandler<
  TQuery,
  TReadModel extends ReadModel | Array<ReadModel> | ReadonlyArray<ReadModel>,
> = (query: TQuery) => Promise<QueryResult<TReadModel>>;
