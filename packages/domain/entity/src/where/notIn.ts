import { NotInWhereCondition, WhereCondition } from '../whereOptions';

export const notIn = <T>(
  value: NotInWhereCondition<T>['value'] | undefined,
): WhereCondition<T> | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return {
    operator: 'notIn' as const,
    value,
  } satisfies NotInWhereCondition<T>;
};
