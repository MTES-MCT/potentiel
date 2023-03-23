import { Option } from '@potentiel/monads';

export type ReadModelId = `${string}#${string}`;
export type ReadModel = Record<string, unknown>;
export type FindReadModel<TReadModel extends ReadModel> = (
  id: ReadModelId,
) => Promise<Option<TReadModel>>;
