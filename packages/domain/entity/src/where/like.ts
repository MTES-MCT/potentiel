import { LikeWhereCondition, WhereCondition } from '../whereOptions';

export const startWith = (value: string | undefined): WhereCondition<string> | undefined => {
  if (!value) {
    return undefined;
  }

  return {
    operator: 'like' as const,
    value: `${value}%`,
  } satisfies LikeWhereCondition;
};

export const endWith = (value: string | undefined): WhereCondition<string> | undefined => {
  if (!value) {
    return undefined;
  }

  return {
    operator: 'like' as const,
    value: `%${value}`,
  } satisfies LikeWhereCondition;
};

export const contains = (value: string | undefined): WhereCondition<string> | undefined => {
  if (!value) {
    return undefined;
  }

  return {
    operator: 'like' as const,
    value: `%${value}%`,
  } satisfies LikeWhereCondition;
};
