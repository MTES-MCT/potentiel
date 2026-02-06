import { LessOrEqualCondition, WhereCondition } from '../whereOptions.js';

export const lessOrEqual = <T>(
  value: LessOrEqualCondition<T>['value'] | undefined,
): WhereCondition<T> | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return {
    operator: 'lessOrEqual' as const,
    value,
  } satisfies LessOrEqualCondition<T>;
};
