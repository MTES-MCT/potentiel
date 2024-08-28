import { LikeWhereCondition, WhereCondition } from '../where';

export const mapToWhereLike = (
  value: LikeWhereCondition['value'] | undefined,
): WhereCondition | undefined => {
  if (!value) {
    return undefined;
  }

  return {
    operator: 'like' as const,
    value,
  } satisfies LikeWhereCondition;
};
