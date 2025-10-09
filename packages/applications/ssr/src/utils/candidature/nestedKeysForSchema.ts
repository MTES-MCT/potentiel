export type NestedKeysForSchema<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object | undefined
        ? `${K}.${NestedKeysForSchema<NonNullable<T[K]>>}` | `${K}`
        : `${K}`;
    }[keyof T & string]
  : never;
