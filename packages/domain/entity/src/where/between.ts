import type { BetweenCondition, WhereCondition } from '../whereOptions.js';

export const between = <T>(
  value: BetweenCondition<T>['value'] | undefined,
): WhereCondition<T> | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return {
    operator: 'between' as const,
    value,
  } satisfies BetweenCondition<T>;
};
