import { NotLikeWhereCondition, WhereCondition } from '../whereOptions.js';

export const notStartWith = (value: string | undefined): WhereCondition<string> | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return {
    operator: 'notLike' as const,
    value: `${value}%`,
  } satisfies NotLikeWhereCondition;
};

export const notEndWith = (value: string | undefined): WhereCondition<string> | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return {
    operator: 'notLike' as const,
    value: `%${value}`,
  } satisfies NotLikeWhereCondition;
};

export const notLike = (value: string | undefined): WhereCondition<string> | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return {
    operator: 'notLike' as const,
    value: `%${value}%`,
  } satisfies NotLikeWhereCondition;
};
