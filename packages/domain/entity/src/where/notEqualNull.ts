import { NotEqualNullWhereCondition, WhereCondition } from '../whereOptions.js';

export const notEqualNull = <T>(): WhereCondition<T> => {
  return {
    operator: 'notEqualNull' as const,
  } satisfies NotEqualNullWhereCondition;
};
