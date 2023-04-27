import { Option } from '@potentiel/monads';

export type ReadModel<
  TType extends string = string,
  TData extends Record<string, unknown> = {},
> = Readonly<
  TData & {
    type: TType;
  }
>;

export type Find = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}#${string}`,
) => Promise<Option<TReadModel>>;

export type ListOptions<TReadModel extends ReadModel> = {
  type: TReadModel['type'];
};

export type List = <TReadModel extends ReadModel>(
  options: ListOptions<TReadModel>,
) => Promise<ReadonlyArray<TReadModel>>;

export type Create = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}#${string}`,
  readModel: Omit<TReadModel, 'type'>,
) => Promise<void>;

export type Update = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}#${string}`,
  readModel: Omit<TReadModel, 'type'>,
) => Promise<void>;

export type Remove = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}#${string}`,
) => Promise<void>;
