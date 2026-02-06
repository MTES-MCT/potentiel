import { EqualNullWhereCondition, WhereCondition } from '../whereOptions.js';

export const equalNull = <T>(): WhereCondition<T> => {
  return {
    operator: 'equalNull' as const,
  } satisfies EqualNullWhereCondition;
};
