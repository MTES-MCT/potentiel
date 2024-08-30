import { NotLikeWhereCondition, WhereCondition } from '../whereOptions';

export const notStartWith = (value: string | undefined): WhereCondition<string> | undefined => {
  if (!value) {
    return undefined;
  }

  return {
    operator: 'notLike' as const,
    value: `${value}%`,
  } satisfies NotLikeWhereCondition;
};

export const notEndWith = (value: string | undefined): WhereCondition<string> | undefined => {
  if (!value) {
    return undefined;
  }

  return {
    operator: 'notLike' as const,
    value: `%${value}`,
  } satisfies NotLikeWhereCondition;
};

export const notContains = (value: string | undefined): WhereCondition<string> | undefined => {
  if (!value) {
    return undefined;
  }

  return {
    operator: 'notLike' as const,
    value: `%${value}%`,
  } satisfies NotLikeWhereCondition;
};
