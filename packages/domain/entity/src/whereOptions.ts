export type EqualWhereCondition<T> = { operator: 'equal'; value: T };
export type NotEqualWhereCondition<T> = { operator: 'notEqual'; value: T };

export type MatchAnyWhereCondition<T> = { operator: 'matchAny'; value: Array<T> };
export type NotMatchAnyWhereCondition<T> = { operator: 'notMatchAny'; value: Array<T> };

export type IncludeWhereCondition<T> = { operator: 'include'; value: T };
export type NotIncludeWhereCondition<T> = { operator: 'notInclude'; value: T };

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

export type LessOrEqualCondition<T> = { operator: 'lessOrEqual'; value: T };
export type GreaterOrEqualCondition<T> = { operator: 'greaterOrEqual'; value: T };

export type WhereCondition<T = {}> =
  | EqualWhereCondition<T>
  | NotEqualWhereCondition<T>
  | LikeWhereCondition
  | NotLikeWhereCondition
  | MatchAnyWhereCondition<T>
  | NotMatchAnyWhereCondition<T>
  | EqualNullWhereCondition
  | NotEqualNullWhereCondition
  | LessOrEqualCondition<T>
  | GreaterOrEqualCondition<T>
  | IncludeWhereCondition<T>
  | NotIncludeWhereCondition<T>;

export type WhereOperator = WhereCondition['operator'];

type Primitive = string | boolean | number | undefined;
type ElementType<T> = T extends (infer U)[] ? U : never;
export type WhereOptions<T> = {
  [P in keyof T]?: T[P] extends Array<Primitive> | undefined
    ? WhereCondition<ElementType<T[P]>>
    : T[P] extends Primitive
      ? WhereCondition<T[P]>
      : T[P] extends Record<string, unknown> | undefined
        ? WhereOptions<T[P]>
        : never;
};
