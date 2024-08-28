import { NotLikeWhereCondition, WhereCondition } from '../where';

export const mapToWhereNotLike = (
  value: NotLikeWhereCondition['value'] | undefined,
): WhereCondition | undefined => {
  if (!value) {
    return undefined;
  }

  return {
    operator: 'notLike' as const,
    value,
  } satisfies NotLikeWhereCondition;
};
