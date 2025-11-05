import { Entity } from './entity';
import { NestedKeys } from './nestedKeys';

export type SelectOptions<T> = NestedKeys<T>[];

export type SelectOptionsParams<
  TEntity extends Entity,
  TSelect extends SelectOptions<Omit<TEntity, 'type'>> | {} = {},
> =
  TSelect extends SelectOptions<Omit<TEntity, 'type'>>
    ? { select: TSelect }
    : { select?: undefined };
