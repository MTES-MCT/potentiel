import { Entity } from './entity.js';
import { NestedKeys } from './nestedKeys.js';
import { WhereOptions } from './whereOptions.js';

export type JoinOptionsParams<
  TEntity extends Entity,
  TJoin extends Entity[] | Entity | {} = {},
> = TJoin extends Entity[]
  ? {
      join: {
        [K in keyof TJoin]: TJoin[K] extends Entity ? JoinOptions<TEntity, TJoin[K]> : never;
      };
    }
  : TJoin extends Entity
    ? { join: JoinOptions<TEntity, TJoin> }
    : { join?: undefined };

export type JoinType = 'left' | 'inner';

export type JoinOptions<TEntity extends Entity = Entity, TJoin extends Entity = Entity> = {
  /**
   * The entity type to join with.
   * Cannot be used more than once in the same join array.
   */
  entity: TJoin['type'];
  /**
   * The key of the original entity to join on.
   * NB: The joined entity is always matched on its key.
   */
  on: NestedKeys<Omit<TEntity, 'type'>>;
  /**
   * Optional additional where conditions to apply to the joined entity
   */
  where?: WhereOptions<Omit<TJoin, 'type' | '__joinType'>>;

  /**
   * If omitted, the join key is the key of the entity
   **/
  joinKey?: keyof Omit<TJoin, 'type'>;
} & (TJoin extends LeftJoin<TJoin> ? { type: 'left' } : { type?: 'inner' });

export type LeftJoin<T> = T & { __joinType: 'left' };
type EntityWithoutType<T extends Entity> =
  T extends LeftJoin<T>
    ? {
        [K in T['type']]?: Omit<T, 'type' | '__joinType'>;
      }
    : {
        [K in T['type']]: Omit<T, 'type' | '__joinType'>;
      };

/**
 *  Joins entity types into a single object, under their "type" field
 *
 *  ```
 *  type A = { type:"a"; foo:string; };
 *  type B = { type:"b"; bar:number; } ;
 *  type AB = Joined<[A,B]>; // => { "a": { foo: string }, "b": { bar:number} }
 *  ```
 **/
export type Joined<TEntity extends Entity | Entity[] | {}> = TEntity extends [infer A, ...infer R]
  ? (A extends Entity ? EntityWithoutType<A> : {}) & Joined<R extends Entity[] ? R : []>
  : TEntity extends Entity
    ? EntityWithoutType<TEntity>
    : {};
