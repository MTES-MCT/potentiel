import { Option } from '@potentiel-libraries/monads';

export type PlainType<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K] extends Array<infer U>
    ? Array<PlainType<U>>
    : T[K] extends ReadonlyArray<infer U>
    ? ReadonlyArray<PlainType<U>>
    : T[K] extends Record<string, unknown>
    ? PlainType<T[K]>
    : T[K] extends Option.Type<infer U>
    ? Option.Type<PlainType<U>>
    : T[K];
};
