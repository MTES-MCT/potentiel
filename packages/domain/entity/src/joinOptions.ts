import { Entity } from './entity';
import { NestedKeys } from './nestedKeys';
import { WhereOptions } from './whereOptions';

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

export type JoinOptions<TEntity extends Entity = Entity, TJoin extends Entity = Entity> = {
  entity: TJoin['type'];
  on: NestedKeys<Omit<TEntity, 'type'>>;
  where?: WhereOptions<Omit<TJoin, 'type'>>;
};

type EntityWithoutType<T extends Entity> = {
  [K in T['type']]: Omit<T, 'type'>;
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
