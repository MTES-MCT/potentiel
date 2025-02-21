import { Entity } from './entity';
import { NestedKeys } from './nestedKeys';
import { WhereOptions } from './whereOptions';

export type JoinOptions<TEntity extends Entity, TJoin extends Entity> = {
  entityType: TJoin['type'];
  key: NestedKeys<Omit<TEntity, 'type'>>;
  where?: WhereOptions<Omit<TJoin, 'type'>>;
};

export type Joined<TEntity extends Entity | {} = {}> = TEntity extends Entity
  ? {
      [K in TEntity['type']]: Omit<TEntity, 'type'>;
    }
  : {};
