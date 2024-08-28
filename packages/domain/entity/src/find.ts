import { Option } from '@potentiel-libraries/monads';

import { Entity } from './entity';

export type Find = <TEntity extends Entity>(
  id: `${TEntity['type']}|${string}`,
) => Promise<Option.Type<TEntity>>;
