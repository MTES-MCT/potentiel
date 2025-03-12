import { NotIncludeWhereCondition, WhereCondition } from '../whereOptions';

export const notInclude = <T>(
  value: NotIncludeWhereCondition<T>['value'] | undefined,
): WhereCondition<T> | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return {
    operator: 'notInclude' as const,
    value,
  } satisfies NotIncludeWhereCondition<T>;
};
