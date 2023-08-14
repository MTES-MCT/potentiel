import { ReadModel } from '@potentiel/core-domain';
import { TypeFichier } from '@potentiel/domain';
import { Option } from '@potentiel/monads';
import { Readable } from 'stream';

export type Find = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
) => Promise<Option<TReadModel>>;

export type ListOptions<TReadModel extends ReadModel> = {
  type: TReadModel['type'];
  orderBy?: keyof TReadModel;
};
export type List = <TReadModel extends ReadModel>(
  options: ListOptions<TReadModel>,
) => Promise<ReadonlyArray<TReadModel>>;

export type SearchResult<TReadModel extends ReadModel> = {
  key: string;
  readModel: TReadModel;
};

export type Search = <TReadModel extends ReadModel>(
  searchKeyExpression: string,
) => Promise<ReadonlyArray<SearchResult<TReadModel>>>;

export type Create = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
  readModel: Omit<TReadModel, 'type'>,
) => Promise<void>;

export type Update = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
  readModel: Omit<TReadModel, 'type'>,
) => Promise<void>;

export type Remove = <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
) => Promise<void>;

export type TéléchargerFichierPort = (args: {
  type: TypeFichier;
  identifiantProjet: string;
  format: string;
}) => Promise<Readable | undefined>;
