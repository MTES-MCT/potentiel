export type ArrayFormKeys<T> = {
  [K in keyof T & string]: T[K] extends (infer U)[]
    ? `${K}` | `${K}.${number}` | `${K}.${number}.${keyof U & string}`
    : `${K}`;
}[keyof T & string];
