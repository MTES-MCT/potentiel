import format from 'pg-format';

import { Entity, WhereOperator, WhereOptions } from '@potentiel-domain/entity';
import { flatten } from '@potentiel-libraries/flat';

export const getWhereClause = <TEntity extends Entity>(
  where: WhereOptions<Omit<TEntity, 'type'>>,
): [clause: string, values: Array<unknown>] => {
  const rawWhere = flatten<typeof where, Record<string, unknown>>(where);
  return mapToWhereClauseAndValues(mapToConditions(rawWhere));
};

type Condition = { name: string; value?: unknown; operator: WhereOperator };

// The input is a record like {'data.name.operator': 'equal', 'data.name.value': 'foo'}
// The return is an array like [{name: "data.name", operator: "equal", value: "foo"}]
const mapToConditions = (flattenWhere: Record<string, unknown>): Array<Condition> =>
  Object.values(
    Object.entries(flattenWhere).reduce(
      (prev, [key, value]) => {
        if (key.endsWith('.operator')) {
          const name = key.replace('.operator', '');
          prev[name] ??= { name };
          prev[name].operator = value as WhereOperator | undefined;
        } else {
          const name = key.replace('.value', '');
          prev[name] ??= { name };
          prev[name].value = value;
        }
        return prev;
      },
      {} as Record<string, Partial<Condition>>,
    ),
  ).filter(
    (condition): condition is Condition =>
      condition.name !== undefined && condition.operator !== undefined,
  );

const mapToWhereClauseAndValues = (
  conditions: Array<Condition>,
): [clause: string, values: Array<unknown>] => {
  const [sqlClause] = conditions.reduce(
    ([prevSql, prevIndex], { operator, name }) => {
      const [newSql, newIndex] = mapOperatorToSqlCondition(operator, prevIndex);
      // format the query to safely pass the parameter name (%L)
      const formattedNewSql = format(newSql, name);
      return [prevSql.concat(' ', formattedNewSql), newIndex] as [string, number];
    },
    // we offset by 2 the index of the sql variable to account for:
    // - the index starting at 1 and not 0
    // - the key always being the first where condition
    ['', 2] as [string, number],
  );
  return [sqlClause, conditions.map(({ value }) => value).filter((value) => value !== undefined)];
};

const mapOperatorToSqlCondition = (operator: WhereOperator, index: number): [string, number] => {
  const baseCondition = 'and value->>%L';
  switch (operator) {
    case 'equal':
      return [`${baseCondition} = $${index}`, index + 1];
    case 'notEqual':
      return [`${baseCondition} <> $${index}`, index + 1];
    case 'like':
      return [`${baseCondition} ILIKE $${index}`, index + 1];
    case 'notLike':
      return [`${baseCondition} NOT ILIKE $${index}`, index + 1];
    case 'include':
      return [`${baseCondition} = ANY($${index})`, index + 1];
    case 'notInclude':
      return [`${baseCondition} <> ALL($${index})`, index + 1];
    case 'lessOrEqual':
      return [`${baseCondition} <= $${index}`, index + 1];
    case 'greaterOrEqual':
      return [`${baseCondition} >= $${index}`, index + 1];
    case 'equalNull':
      return [`${baseCondition} IS NULL`, index];
    case 'notEqualNull':
      return [`${baseCondition} IS NOT NULL`, index];
  }
  return assertUnreachable(operator);
};

function assertUnreachable(operator: never): never {
  throw new Error(`Unknown operator ${operator}`);
}
