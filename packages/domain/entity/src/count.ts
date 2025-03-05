import { Entity } from './entity';
import { JoinOptions } from './joinOptions';
import { WhereOptions } from './whereOptions';

export type CountOption<TEntity extends Entity, TJoin extends Entity | {} = {}> = {
  where?: WhereOptions<Omit<TEntity, 'type'>>;
} & (TJoin extends Entity ? { join: JoinOptions<TEntity, TJoin> } : { join?: undefined });

export type Count = <TEntity extends Entity, TJoin extends Entity | {} = {}>(
  category: TEntity['type'],
  options?: CountOption<TEntity, TJoin>,
) => Promise<number>;
