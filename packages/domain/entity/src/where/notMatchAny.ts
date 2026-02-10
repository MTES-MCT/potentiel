import { NotMatchAnyWhereCondition, WhereCondition } from '../whereOptions.js';

/** The value does not match any of the values in the array */
export const notMatchAny = <T>(
  value: NotMatchAnyWhereCondition<T>['value'] | undefined,
): WhereCondition<T> | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return {
    operator: 'notMatchAny' as const,
    value,
  } satisfies NotMatchAnyWhereCondition<T>;
};
