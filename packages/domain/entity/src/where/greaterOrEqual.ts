import { GreaterOrEqualCondition, WhereCondition } from '../whereOptions.js';

export const greaterOrEqual = <T>(
  value: GreaterOrEqualCondition<T>['value'] | undefined,
): WhereCondition<T> | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return {
    operator: 'greaterOrEqual' as const,
    value,
  } satisfies GreaterOrEqualCondition<T>;
};
