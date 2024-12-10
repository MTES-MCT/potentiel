export type Order = 'ascending' | 'descending';

export type OrderByOptions<T> = {
  [P in keyof T]?: T[P] extends string | boolean | number | undefined
    ? Order
    : T[P] extends Record<string, unknown> | undefined
      ? OrderByOptions<NonNullable<T[P]>>
      : never;
};
