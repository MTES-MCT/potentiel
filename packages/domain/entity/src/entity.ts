export type Entity<
  TType extends string = string,
  TData extends Record<string, unknown> = Record<never, never>,
> = Readonly<
  TData & {
    type: TType;
  }
>;
