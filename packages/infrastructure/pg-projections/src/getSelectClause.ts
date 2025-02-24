import { Entity, SelectOptions } from '@potentiel-domain/entity';

export const getSelectClause = <TEntity extends Entity>({
  select,
  join,
}: {
  select?: SelectOptions<Omit<TEntity, 'type'>>;
  join?: boolean;
}): string => {
  if (!select || select.length === 0) {
    return addProjection('SELECT p1.key, p1.value', join);
  }

  const selectValues = select
    .map((field) => `'${String(field)}', p1.value->>'${String(field)}'`)
    .join(', ');

  return addProjection(`SELECT p1.key, jsonb_build_object(${selectValues}) as value`, join);
};

export const addProjection = (query: string, projection?: boolean) => {
  if (!projection) return query;
  return `${query}, p2.value as "join_value"`;
};
