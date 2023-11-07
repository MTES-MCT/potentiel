export type ReadonlyValueType<T> = Readonly<
  T & {
    estÉgaleÀ(valueType: ReadonlyValueType<T>): boolean;
  }
>;
