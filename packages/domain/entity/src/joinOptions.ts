import { Entity } from './entity';
import { NestedKeys } from './nestedKeys';
import { WhereOptions } from './whereOptions';

export type JoinOptionsParams<
  TEntity extends Entity,
  TJoin extends Entity | {} = {},
  TJoin2 extends Entity | {} = {},
> = TJoin extends Entity
  ? TJoin2 extends Entity
    ? { join: [JoinOptions<TEntity, TJoin>, JoinOptions<TEntity, TJoin2>] }
    : { join: JoinOptions<TEntity, TJoin> }
  : { join?: undefined };

export type JoinOptions<TEntity extends Entity = Entity, TJoin extends Entity = Entity> = {
  entity: TJoin['type'];
  on: NestedKeys<Omit<TEntity, 'type'>>;
  where?: WhereOptions<Omit<TJoin, 'type'>>;
};

export type Joined<TEntity extends Entity | {} = {}> = TEntity extends Entity
  ? {
      [K in TEntity['type']]: Omit<TEntity, 'type'>;
    }
  : {};
