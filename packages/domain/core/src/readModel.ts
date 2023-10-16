export type ReadModel<
  TType extends string = string,
  TData extends Record<string, unknown> = {},
> = Readonly<
  TData & {
    type: TType;
  }
>;
