import { NotIncludeWhereCondition, WhereCondition } from '../whereOptions.js';

/** Check for the absence of an element in a primitive type array */
export const notInclude = <T>(
  value: NotIncludeWhereCondition<T>['value'] | undefined,
): WhereCondition<T> | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return {
    operator: 'notInclude' as const,
    value,
  } satisfies NotIncludeWhereCondition<T>;
};
