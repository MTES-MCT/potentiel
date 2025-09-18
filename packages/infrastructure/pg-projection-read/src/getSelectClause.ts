import format from 'pg-format';

import { Entity, SelectOptions } from '@potentiel-domain/entity';

export const getSelectClause = <TEntity extends Entity>({
  select,
  joinCategories,
}: {
  select?: SelectOptions<Omit<TEntity, 'type'>>;
  joinCategories: string[];
}): string => {
  if (!select || select.length === 0) {
    return addProjection('SELECT p.key, p.value', joinCategories);
  }

  const selectValues = select.map((field) => format('%L, p.value->>%L', field, field)).join(', ');

  return addProjection(
    `SELECT p.key, jsonb_build_object(${selectValues}) as value`,
    joinCategories,
  );
};

export const addProjection = (query: string, joinCategories: string[]) => {
  if (joinCategories.length === 0) return query;

  const array = joinCategories.map((category) => {
    return format(`jsonb_build_object('category',%L, 'value',%I.value)`, category, category);
  }, [] as string[]);

  return format(`%s, ARRAY[${array.join(',')}] as join_values`, query);
};
