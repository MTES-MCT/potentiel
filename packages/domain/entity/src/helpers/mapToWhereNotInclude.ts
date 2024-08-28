import { NotIncludeWhereCondition, WhereCondition } from '../where';

export const mapToWhereNotInclude = <T>(
  value: NotIncludeWhereCondition<T>['value'] | undefined,
): WhereCondition<T> | undefined => {
  if (!value) {
    return undefined;
  }

  return {
    operator: 'notInclude' as const,
    value,
  } satisfies NotIncludeWhereCondition<T>;
};
