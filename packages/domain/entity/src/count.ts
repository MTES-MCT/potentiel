import { Entity } from './entity';
import { JoinOptionsParams } from './joinOptions';
import { WhereOptions } from './whereOptions';

export type CountOption<TEntity extends Entity, TJoin extends Entity | Entity[] | {} = {}> = {
  where?: WhereOptions<Omit<TEntity, 'type'>>;
} & JoinOptionsParams<TEntity, TJoin>;

export type Count = <TEntity extends Entity, TJoin extends Entity | Entity[] | {} = {}>(
  category: TEntity['type'],
  options?: CountOption<TEntity, TJoin>,
) => Promise<number>;
