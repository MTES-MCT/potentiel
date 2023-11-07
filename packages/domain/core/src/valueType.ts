export type ReadonlyValueType<TValueType> = Readonly<
  TValueType & {
    estÉgaleÀ(valueType: ReadonlyValueType<TValueType>): boolean;
  }
>;
