export type EqualWhereCondition<T> = { operator: 'equal'; value: T };
export type NotEqualWhereCondition<T> = { operator: 'notEqual'; value: T };

export type IncludeWhereCondition<T> = { operator: 'include'; value: Array<T> };
export type NotIncludeWhereCondition<T> = { operator: 'notInclude'; value: Array<T> };

export type LikeWhereCondition = {
  operator: 'like';
  value: `%${string}` | `${string}%` | `%${string}%`;
};

export type NotLikeWhereCondition = {
  operator: 'notLike';
  value: `%${string}` | `${string}%` | `%${string}%`;
};

export type EqualNullWhereCondition = { operator: 'equalNull' };
export type NotEqualNullWhereCondition = { operator: 'notEqualNull' };

export type WhereCondition<T = {}> =
  | EqualWhereCondition<T>
  | NotEqualWhereCondition<T>
  | LikeWhereCondition
  | NotLikeWhereCondition
  | IncludeWhereCondition<T>
  | NotIncludeWhereCondition<T>
  | EqualNullWhereCondition
  | NotEqualNullWhereCondition;

export type WhereOperator = WhereCondition['operator'];

export type WhereOptions<T> = {
  [P in keyof T]?: T[P] extends string | boolean | number | undefined
    ? WhereCondition<T[P]>
    : T[P] extends Record<string, unknown> | undefined
      ? WhereOptions<T[P]>
      : never;
};
