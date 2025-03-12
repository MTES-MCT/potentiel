import { IncludeWhereCondition, WhereCondition } from '../whereOptions';

export const include = <T>(
  value: IncludeWhereCondition<T>['value'] | undefined,
): WhereCondition<T> | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return {
    operator: 'include' as const,
    value,
  } satisfies IncludeWhereCondition<T>;
};
