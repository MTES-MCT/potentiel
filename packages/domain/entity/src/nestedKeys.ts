export type NestedKeys<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${NestedKeys<T[K]> extends never ? '' : `.${NestedKeys<T[K]>}`}`;
    }[keyof T]
  : never;
