import { Entity } from './entity';
import { NestedKeys } from './nestedKeys';

export type JoinOptions<TEntity extends Entity, TJoin extends Entity> = {
  projection: TJoin['type'];
  key: NestedKeys<Omit<TEntity, 'type'>>;
};

export type Joined<TEntity extends Entity | {} = {}> = TEntity extends Entity
  ? {
      [K in TEntity['type']]: Omit<TEntity, 'type'>;
    }
  : {};
