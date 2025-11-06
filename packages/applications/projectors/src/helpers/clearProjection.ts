import { Entity } from '@potentiel-domain/entity';
import {
  removeProjection,
  removeProjectionByCategory,
} from '@potentiel-infrastructure/pg-projection-write';

/** Delete the projection for the given key, or the whole category */
export const clearProjection = async <TEntity extends Entity>(
  category: TEntity['type'],
  key: string | undefined,
) => {
  if (key) {
    await removeProjection<TEntity>(`${category}|${key}`);
  } else {
    await removeProjectionByCategory(category);
  }
};
