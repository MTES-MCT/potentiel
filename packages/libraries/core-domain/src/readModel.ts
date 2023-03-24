import { Option } from '@potentiel/monads';

export type ReadModel<
  TType extends string = string,
  TData extends Record<string, unknown> = {},
> = Readonly<
  TData & {
    type: TType;
  }
>;

export type Find<TReadModel extends ReadModel> = (
  id: `${TReadModel['type']}#${string}`,
) => Promise<Option<Omit<TReadModel, 'type'>>>;

export type Create<TReadModel extends ReadModel> = (
  id: `${TReadModel['type']}#${string}`,
  readModel: Omit<TReadModel, 'type'>,
) => Promise<void>;
