import type { Option } from '@potentiel-libraries/monads';

import type { Entity } from './entity';
import type { Joined, JoinOptions } from './joinOptions';
import type { SelectOptions } from './selectOptions';

export type FindOptions<TEntity extends Entity, TJoin extends Entity | {} = {}> = {
  select?: SelectOptions<Omit<TEntity, 'type'>>;
} & (TJoin extends Entity ? { join: JoinOptions<TEntity, TJoin> } : { join?: undefined });

export type Find = <TEntity extends Entity, TJoin extends Entity | {} = {}>(
  id: `${TEntity['type']}|${string}`,
  options?: FindOptions<TEntity, TJoin>,
) => Promise<Option.Type<TEntity & Joined<TJoin>>>;
