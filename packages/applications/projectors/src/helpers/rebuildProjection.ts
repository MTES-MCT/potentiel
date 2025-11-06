import { Entity } from '@potentiel-domain/entity';
import {
  removeProjection,
  removeProjectionByCategory,
} from '@potentiel-infrastructure/pg-projection-write';

export const rebuildProjection = async <TEntity extends Entity>(
  category: TEntity['type'],
  id: string | undefined,
) => {
  if (id) {
    await removeProjection<TEntity>(`${category}|${id}`);
  } else {
    await removeProjectionByCategory(category);
  }
};
