import { NotEqualWhereCondition, WhereCondition } from '../where';

export const mapToWhereNotEqual = <T>(
  value: NotEqualWhereCondition<T>['value'] | undefined,
): WhereCondition<T> | undefined => {
  if (!value) {
    return undefined;
  }

  return {
    operator: 'notEqual' as const,
    value,
  } satisfies NotEqualWhereCondition<T>;
};
