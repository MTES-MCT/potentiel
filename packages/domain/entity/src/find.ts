import { Option } from '@potentiel-libraries/monads';

import { Entity } from './entity';
import { SelectOptions } from './selectOptions';

export type Find = <TEntity extends Entity>(
  id: `${TEntity['type']}|${string}`,
) => Promise<Option.Type<TEntity>>;

export type FindOptions<TEntity extends Entity> = {
  select?: SelectOptions<Omit<TEntity, 'type'>>;
};
