import { NotEqualWhereCondition, WhereCondition } from '../whereOptions.js';

export const notEqual = <T>(
  value: NotEqualWhereCondition<T>['value'] | undefined,
): WhereCondition<T> | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return {
    operator: 'notEqual' as const,
    value,
  } satisfies NotEqualWhereCondition<T>;
};
