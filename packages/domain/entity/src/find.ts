import { Option } from '@potentiel-libraries/monads';

import { Entity } from './entity';
import { SelectOptions } from './selectOptions';
import { Joined, JoinOptions } from './joinOptions';

export type FindOptions<TEntity extends Entity, TJoin extends Entity | {} = {}> = {
  select?: SelectOptions<Omit<TEntity, 'type'>>;
} & (TJoin extends Entity ? { join: JoinOptions<TEntity, TJoin> } : { join?: undefined });

export type Find = <TEntity extends Entity, TJoin extends Entity | {} = {}>(
  id: `${TEntity['type']}|${string}`,
  options?: FindOptions<TEntity, TJoin>,
) => Promise<Option.Type<TEntity & Joined<TJoin>>>;
