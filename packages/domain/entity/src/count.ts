import { Entity } from './entity';
import { WhereOptions } from './where';

export type CountOption<TEntity extends Entity> = {
  where?: WhereOptions<Omit<TEntity, 'type'>>;
};

export type Count = <TEntity extends Entity>(
  category: TEntity['type'],
  options?: CountOption<TEntity>,
) => Promise<number>;
