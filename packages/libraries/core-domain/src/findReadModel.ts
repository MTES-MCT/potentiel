import { Option } from '@potentiel/monads';

type ReadModelId = `${string}#${string}`;

export type FindReadModel<TReadModel> = (id: ReadModelId) => Promise<Option<TReadModel>>;
