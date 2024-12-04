import { Entity, SelectOptions } from '@potentiel-domain/entity';

export const getSelectClause = <TEntity extends Entity>(
  select?: SelectOptions<Omit<TEntity, 'type'>>,
): string => {
  if (!select || select.length === 0) {
    return 'SELECT key, value';
  }

  const selectValues = select
    .map((field) => `'${String(field)}', value->>'${String(field)}'`)
    .join(', ');

  return `SELECT key, jsonb_build_object(${selectValues}) as value`;
};
