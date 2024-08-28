import { EqualWhereCondition, WhereCondition } from '../where';

export const mapToWhereEqual = <T>(
  value: EqualWhereCondition<T>['value'] | undefined,
): WhereCondition<T> | undefined => {
  if (!value) {
    return undefined;
  }

  return {
    operator: 'equal' as const,
    value,
  } satisfies EqualWhereCondition<T>;
};
