import { Option } from '@potentiel-libraries/monads';

import { Entity } from './entity';
import { SelectOptions } from './selectOptions';
import { Joined, JoinOptionsParams } from './joinOptions';

export type FindOptions<TEntity extends Entity, TJoin extends Entity | Entity[] | {} = {}> = {
  select?: SelectOptions<Omit<TEntity, 'type'>>;
} & JoinOptionsParams<TEntity, TJoin>;

export type Find = <TEntity extends Entity, TJoin extends Entity | Entity[] | {} = {}>(
  id: `${TEntity['type']}|${string}`,
  options?: FindOptions<TEntity, TJoin>,
) => Promise<Option.Type<TEntity & Joined<TJoin>>>;
