import { IncludeWhereCondition, WhereCondition } from '../where';

export const mapToWhereInclude = <T>(
  value: IncludeWhereCondition<T>['value'] | undefined,
): WhereCondition<T> | undefined => {
  if (!value) {
    return undefined;
  }

  return {
    operator: 'include' as const,
    value,
  } satisfies IncludeWhereCondition<T>;
};
