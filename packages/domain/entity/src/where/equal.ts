import { EqualWhereCondition, WhereCondition } from '../whereOptions.js';

export const equal = <T>(
  value: EqualWhereCondition<T>['value'] | undefined,
): WhereCondition<T> | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return {
    operator: 'equal' as const,
    value,
  } satisfies EqualWhereCondition<T>;
};
