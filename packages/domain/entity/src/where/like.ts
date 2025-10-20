import { LikeWhereCondition, WhereCondition } from '../whereOptions';

export const startWith = (value: string | undefined): WhereCondition<string> | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return {
    operator: 'like' as const,
    value: `${value}%`,
  } satisfies LikeWhereCondition;
};

export const endWith = (value: string | undefined): WhereCondition<string> | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return {
    operator: 'like' as const,
    value: `%${value}`,
  } satisfies LikeWhereCondition;
};

export const like = (value: string | undefined): WhereCondition<string> | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return {
    operator: 'like' as const,
    value: `%${value}%`,
  } satisfies LikeWhereCondition;
};
