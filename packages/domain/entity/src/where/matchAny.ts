import { MatchAnyWhereCondition, WhereCondition } from '../whereOptions';

/** The value matches exactly one of the values in the array */
export const matchAny = <T>(
  value: MatchAnyWhereCondition<T>['value'] | undefined,
): WhereCondition<T> | undefined => {
  if (!value) {
    return undefined;
  }

  return {
    operator: 'matchAny' as const,
    value,
  } satisfies MatchAnyWhereCondition<T>;
};
