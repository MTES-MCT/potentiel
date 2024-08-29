export type Order = 'ascending' | 'descending';

export type OrderByOptions<T> = {
  [P in keyof T]?: T[P] extends string | boolean | number
    ? Order
    : T[P] extends Record<string, unknown>
      ? OrderByOptions<T[P]>
      : never;
};
