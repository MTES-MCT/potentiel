import { Option } from '@potentiel-libraries/monads';

import { Entity } from './entity';
import { SelectOptions } from './selectOptions';
import { WhereOptions } from './whereOptions';

export type FindOptions<TEntity extends Entity> = {
  select?: SelectOptions<Omit<TEntity, 'type'>>;
  where?: WhereOptions<Omit<TEntity, 'type'>>;
};

export type Find = <TEntity extends Entity>(
  id: `${TEntity['type']}|${string}`,
  options?: FindOptions<TEntity>,
) => Promise<Option.Type<TEntity>>;
