import { Option } from '@potentiel-libraries/monads';

import { Entity } from './entity';
import { SelectOptions, SelectOptionsParams } from './selectOptions';
import { Joined, JoinOptionsParams } from './joinOptions';
import { PickByPaths } from './pickByPaths';

export type FindOptions<
  TEntity extends Entity,
  TJoin extends Entity | Entity[] | {} = {},
  TSelect extends SelectOptions<Omit<TEntity, 'type'>> | {} = {},
> = SelectOptionsParams<TEntity, TSelect> & JoinOptionsParams<TEntity, TJoin>;

export type FindResult<
  TEntity extends Entity,
  TJoin extends Entity | Entity[] | {},
  TSelect extends SelectOptions<Omit<TEntity, 'type'>> | {} = {},
> =
  TSelect extends SelectOptions<Omit<TEntity, 'type'>>
    ? PickByPaths<Omit<TEntity, 'type'>, TSelect> & Pick<TEntity, 'type'> & Joined<TJoin>
    : TEntity & Joined<TJoin>;

export type Find = <
  TEntity extends Entity,
  TJoin extends Entity | Entity[] | {} = {},
  TSelect extends SelectOptions<Omit<TEntity, 'type'>> | {} = {},
>(
  id: `${TEntity['type']}|${string}`,
  options?: FindOptions<TEntity, TJoin, TSelect>,
) => Promise<Option.Type<FindResult<TEntity, TJoin, TSelect>>>;
