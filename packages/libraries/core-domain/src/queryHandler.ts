import { ReadModel } from './readModel';

export type QueryHandler<TQuery, TReadModel extends ReadModel> = (
  query: TQuery,
) => Promise<Omit<TReadModel, 'type'>>;
