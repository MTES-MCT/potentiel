import format from 'pg-format';
import { match } from 'ts-pattern';

import {
  Entity,
  EqualWhereCondition,
  JoinOptions,
  LikeWhereCondition,
  WhereOperator,
  WhereOptions,
} from '@potentiel-domain/entity';
import { flatten } from '@potentiel-libraries/flat';

type Condition = { name: string; value?: unknown; operator: WhereOperator };

type GetWhereClauseOptions<TEntity extends Entity, TJoin extends Entity | {} = {}> = {
  key: EqualWhereCondition<string> | LikeWhereCondition;
  where?: WhereOptions<Omit<TEntity, 'type'>>;
} & (TJoin extends Entity ? { join: JoinOptions<TEntity, TJoin> } : { join?: undefined });

/** Returns the whole where clause (including key, filters, and join), and parameters */
export const getWhereClause = <TEntity extends Entity, TJoin extends Entity | {} = {}>({
  key,
  where,
  join,
}: GetWhereClauseOptions<TEntity, TJoin>): [clause: string, values: Array<unknown>] => {
  const baseWhereClause = key.operator === 'like' ? `where p1.key LIKE $1` : `where p1.key = $1`;

  const [whereClause, whereValues] = where ? buildWhereClause(where, 'p1') : ['', []];

  const [joinWhereClause, joinWhereValues] = join?.where
    ? buildWhereClause(join.where, 'p2', whereValues.length)
    : ['', []];
  const completeWhereClause = `${baseWhereClause} ${whereClause} ${joinWhereClause}`;

  return [completeWhereClause, [key.value, ...whereValues, ...joinWhereValues]];
};

/**
  Build the SQL WHERE clause and the array of values based on input filters
  the returned SQL clause uses $3, $4... instead of variables to prevent SQL injection
  NB: $1 is already used by the key of the projection (see methods calling `getWhereClause`)
  @param projection can be used to differentiate which projection to filter
  @param startIndex can be used to shift the index of variables, if multiple where clause are combined
*/
const buildWhereClause = <TEntity extends Entity>(
  where: WhereOptions<Omit<TEntity, 'type'>>,
  projection: string,
  startIndex = 0,
): [clause: string, values: Array<unknown>] => {
  const rawWhere = flatten<typeof where, Record<string, unknown>>(where);
  const conditions = mapToConditions(rawWhere);
  const [sqlClause] = conditions.reduce(
    ([prevSql, prevIndex], { operator, name }) => {
      const [newSql, newIndex] = mapOperatorToSqlCondition(operator, prevIndex, projection);
      // format the query to safely pass the parameter name (%L)
      const formattedNewSql = format(newSql, name);
      return [prevSql.concat(' and ', formattedNewSql), newIndex] as [string, number];
    },
    // we offset by 2 the index of the sql variable to account for:
    // - the index starting at 1 and not 0
    // - the key always being the first where condition
    ['', 2 + startIndex] as [string, number],
  );
  return [sqlClause, conditions.map(({ value }) => value).filter((value) => value !== undefined)];
};

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

// Builds the SQL query condition, based on operator type
// Returns the SQL query, with the next variable index ($2...)
// this is due to some operators not requiring an index (isNull...)
const mapOperatorToSqlCondition = (
  operator: WhereOperator,
  index: number,
  projection: string,
): [clause: string, variableIndex: number] => {
  const baseCondition = format('%I.value->>%%L', projection);
  const baseConditionObject = format('%I.value->%%L', projection);
  return match(operator)
    .returnType<[clause: string, variableIndex: number]>()
    .with('equal', () => [`${baseCondition} = $${index}`, index + 1])
    .with('notEqual', () => [`${baseCondition} <> $${index}`, index + 1])
    .with('like', () => [`${baseCondition} ILIKE $${index}`, index + 1])
    .with('notLike', () => [`${baseCondition} NOT ILIKE $${index}`, index + 1])
    .with('matchAny', () => [`${baseCondition} = ANY($${index})`, index + 1])
    .with('notMatchAny', () => [`${baseCondition} <> ALL($${index})`, index + 1])
    .with('lessOrEqual', () => [`${baseCondition} <= $${index}`, index + 1])
    .with('greaterOrEqual', () => [`${baseCondition} >= $${index}`, index + 1])
    .with('equalNull', () => [`${baseCondition} IS NULL`, index])
    .with('notEqualNull', () => [`${baseCondition} IS NOT NULL`, index])
    .with('include', () => [`${baseConditionObject} ? $${index}`, index])
    .with('notInclude', () => [`NOT ${baseConditionObject} ? $${index} `, index + 1])
    .exhaustive();
};
