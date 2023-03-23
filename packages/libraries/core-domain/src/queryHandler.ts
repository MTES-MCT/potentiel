export type QueryHandler<TQuery, TReadModel> = (query: TQuery) => Promise<TReadModel>;
