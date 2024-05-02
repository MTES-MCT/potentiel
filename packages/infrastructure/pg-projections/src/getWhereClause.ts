import { Entity, WhereOperator, WhereOptions } from '@potentiel-domain/core';
import { flatten } from '@potentiel-libraries/flat';
import format from 'pg-format';

export const getWhereClause = <TEntity extends Entity>(
  where: WhereOptions<Omit<TEntity, 'type'>>,
): [clause: string, values: Array<unknown>] => {
  const rawWhere = flatten<typeof where, Record<string, unknown>>(where);

  const clause = mapToWhereClause(getWhereOperators(rawWhere));
  const values = getWhereValues(rawWhere);

  return [clause, values];
};

const getWhereValues = (flattenWhere: Record<string, unknown>) =>
  Object.entries(flattenWhere)
    .filter(([key]) => key.endsWith('.value'))
    .map(([_, value]) => value);

const getWhereOperators = (flattenWhere: Record<string, unknown>) =>
  Object.entries(flattenWhere)
    .filter(([key]) => key.endsWith('.operator'))
    .map(([key, value]) => {
      return {
        name: key.replace('.operator', ''),
        operator: value as WhereOperator,
      };
    });

const mapToWhereClause = (operators: Array<{ name: string; operator: WhereOperator }>) =>
  format(
    operators.map(({ operator }, index) => mapOperatorToSqlCondition(operator, index)).join(' '),
    ...operators.map(({ name }) => name),
  );

const mapOperatorToSqlCondition = (value: WhereOperator, index: number) => {
  const baseCondition = 'and value->>%L';
  switch (value) {
    case 'equal':
      return `${baseCondition} = $${index + 2}`;
    case 'notEqual':
      return `${baseCondition} <> $${index + 2}`;
    case 'like':
      return `${baseCondition} ILIKE $${index + 2}`;
    case 'notLike':
      return `${baseCondition} NOT ILIKE $${index + 2}`;
    case 'include':
      return `${baseCondition} = ANY($${index + 2})`;
    case 'notInclude':
      return `${baseCondition} <> ALL($${index + 2})`;
  }
};
