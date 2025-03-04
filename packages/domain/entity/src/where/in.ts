import { InWhereCondition, WhereCondition } from '../whereOptions';

// in is a reserved keyword
export const in_ = <T>(
  value: InWhereCondition<T>['value'] | undefined,
): WhereCondition<T> | undefined => {
  if (!value) {
    return undefined;
  }

  return {
    operator: 'in' as const,
    value,
  } satisfies InWhereCondition<T>;
};
