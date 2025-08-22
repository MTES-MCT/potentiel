export type PlainType<T> =
  T extends Array<infer U>
    ? Array<PlainType<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<PlainType<U>>
      : {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
          [K in keyof T as T[K] extends Function ? never : K]: T[K] extends Array<infer U>
            ? Array<PlainType<U>>
            : T[K] extends ReadonlyArray<infer U>
              ? ReadonlyArray<PlainType<U>>
              : T[K] extends Record<string, unknown>
                ? PlainType<T[K]>
                : T[K] extends Date
                  ? `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`
                  : PlainType<T[K]>;
        };

export const mapToPlainObject = <T>(obj: T) => JSON.parse(JSON.stringify(obj)) as PlainType<T>;
